const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    name: 'kick',
    category: 'Moderation',
    aliases: [],
    description: 'Kick a member from the server.',
    usage: 'kick @user|ID [reason]',
    examples: ["kick @QrIvan Test", "kick 828991790324514887 Test"],
    run: async (client, message, args) => {
        if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
            const noPermissionEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('**KICK** | Permission Denied')
                .setDescription('You do not have permissions to use this command.');
            return message.reply({ embeds: [noPermissionEmbed] });
        }

        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!target) {
            const noUserMentionedEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('**KICK** | Missing User Mention')
                .setDescription('Valid use: `h/kick [@user|user_id] [reason]`.');
            return message.reply({ embeds: [noUserMentionedEmbed] });
        }

        if (!message.guild.me.permissions.has('KICK_MEMBERS')) {
            const botNoPermissionEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('**KICK** | Bot Permission Denied')
                .setDescription('The bot does not have permissions to kick members.');
            return message.reply({ embeds: [botNoPermissionEmbed] });
        }

        if (target.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) {
            const roleTooHighEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('**KICK** | Role Hierarchy Issue')
                .setDescription('I cannot kick this user due to their roles.');
            return message.reply({ embeds: [roleTooHighEmbed] });
        }

        const reason = args.slice(1).join(' ') || 'Force-Kick';
        try {
            await target.kick(reason);

            const modLogEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('Honie Studios | Kick Log')
                .setDescription(`**Kicked User:** ${target.user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}`);

            const LOGS_CHANNEL = 'LOGS_CHANNEL'; // Importa LOGS_CHANNEL 
            const modLogChannel = message.guild.channels.cache.get(LOGS_CHANNEL);

            if (modLogChannel && modLogChannel.type === 'text') {
                modLogChannel.send({ embeds: [modLogEmbed] });
            }

            const kickEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('Honie Server | Left the Server')
                .setDescription(`You have been kicked from the server **${message.guild.name}**`)
                .addField('Moderator', message.author.tag)
                .addField('Reason', reason)
                .addField('Invitation', '[Click Here](https://rebrand.ly/folkdiscord)')
                .setFooter('If you wish to return to the server, here is an invitation.');

            target.user.send({ embeds: [kickEmbed] })
                .catch(error => {
                    console.error(`[CONSOLE ERROR] Error sending a private message to ${target.user.tag}: ${error}`);
                });

            message.channel.send({ embeds: [modLogEmbed] });
        } catch (error) {
            console.error(error);
            const kickErrorEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('**KICK** | Error Kicking User')
                .setDescription('An error occurred while trying to kick the user.');
            return message.reply({ embeds: [kickErrorEmbed] });
        }
    },
};
