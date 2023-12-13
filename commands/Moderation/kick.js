const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    name: 'kick',
    category: 'Moderation',
    aliases: [],
    description: 'Kick a member from the server.',
    usage: 'kick @user|ID [reason]',
    examples: ["kick @QrIvan Test", "kick 828991790324514887 Test"],
    run: async (client, message, args) => {
        // Check user permissions
        if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
            const noPermissionEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('`sytem@user/perms/kick`\n<:Moderator_Logo:1183460215782391828> **KICK** | Permission Denied')
                .setDescription('You do not have permissions to use this command.');
            return message.reply({ embeds: [noPermissionEmbed] });
        }

        // Check if a user is mentioned or provided by ID
        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!target) {
            const noUserMentionedEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('`sytem@user/error/kick`\n<:Moderator_Logo:1183460215782391828> **KICK** | Missing User Mention')
                .setDescription('Valid use: `h/kick [@user|user_id] [reason]`.');
            return message.reply({ embeds: [noUserMentionedEmbed] });
        }

        // Check if the bot has permissions to kick members
        if (!message.guild.me.permissions.has('KICK_MEMBERS')) {
            const botNoPermissionEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('`sytem@user/error/kick`\n<:Moderator_Logo:1183460215782391828> **KICK** | Bot Permission Denied')
                .setDescription('The bot does not have permissions to kick members.');
            return message.reply({ embeds: [botNoPermissionEmbed] });
        }

        // Check if the member has a role higher than the bot's role
        if (target.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) {
            const roleTooHighEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('`sytem@user/error/kick`\n<:Moderator_Logo:1183460215782391828> **KICK** | Role Hierarchy Issue')
                .setDescription('I cannot kick this user due to their roles.');
            return message.reply({ embeds: [roleTooHighEmbed] });
        }

        // Check if a reason for the kick is provided
        const reason = args.slice(1).join(' ') || 'Force-Kick';

        // Perform the kick
        try {
            await target.kick(reason);

            // Create an embed message for the moderation log channel
            const modLogEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('`sytem@user/modlog/kick`\n<a:uh_stafflogo:1183420465902006273> Honie Studios | Kick Log')
                .setDescription(`**Kicked User:** ${target.user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}`);

            // Send the log to the moderation log channel
            const LOGS_CHANNEL = '1163269047283101716'; // Importa LOGS_CHANNEL 
            const modLogChannel = message.guild.channels.cache.get(LOGS_CHANNEL);

            if (modLogChannel && modLogChannel.type === 'text') {
                modLogChannel.send({ embeds: [modLogEmbed] });
            }

            // Create an embed message to send to the kicked user
            const kickEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('`sytem@user/kicked`\n<a:uh_stafflogo:1183420465902006273> Honie Server | Left the Server')
                .setDescription(`You have been kicked from the server **${message.guild.name}**`)
                .addField('Moderator', message.author.tag)
                .addField('Reason', reason)
                .addField('Invitation', '[Click Here](https://rebrand.ly/honiediscord)')
                .setFooter('If you wish to return to the server, here is an invitation.');

            // Send a private message to the kicked user with the embed
            target.user.send({ embeds: [kickEmbed] })
                .catch(error => {
                    console.error(`[CONSOLE ERROR] Error sending a private message to ${target.user.tag}: ${error}`);
                });

            message.channel.send({ embeds: [modLogEmbed] });
        } catch (error) {
            console.error(error);
            const kickErrorEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('`sytem@user/error/kick`\n<:Moderator_Logo:1183460215782391828> **KICK** | Error Kicking User')
                .setDescription('An error occurred while trying to kick the user.');
            return message.reply({ embeds: [kickErrorEmbed] });
        }
    },
};
