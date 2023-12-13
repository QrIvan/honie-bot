const { MessageEmbed, Permissions } = require('discord.js');
const Ban = require('..//..//database/models/banModel'); // Import the Ban model from Mongoose
const LOGS_CHANNEL_ID = '1183447592395350128'; // Replace LOGS_CHANNEL with the specific channel ID

module.exports = {
    name: 'ban',
    category: 'Moderation',
    aliases: [],
    description: 'Ban a member from the server.',
    usage: 'ban @user|ID [reason]',
    examples: ["ban @QrIvan Testing", "ban 828991790324514887 Testing"],
    run: async (client, message, args) => {
        // Check user permissions
        if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            const noPermissionEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('`sytem@user/perms/ban`\n<:Moderator_Logo:1183460215782391828> **BAN** | Permission Denied')
                .setDescription('You do not have permissions to use this command.');
            return message.reply({ embeds: [noPermissionEmbed] });
        }

        // Check if a user is mentioned or a valid user ID is provided
        let target;
        const userID = args[0];

        if (message.mentions.members.size > 0) {
            target = message.mentions.members.first();
        } else if (userID && !isNaN(userID)) {
            target = await message.guild.members.fetch(userID).catch(() => null);
        }

        if (!target) {
            const invalidUserEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('`sytem@user/error/ban`\n<:Moderator_Logo:1183460215782391828> **BAN** | Invalid User')
                .setDescription('Valid use: `h/ban [@user|user_id] [reason]`.');
            return message.reply({ embeds: [invalidUserEmbed] });
        }

        // Check if the bot has permissions to ban members
        if (!message.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            const botNoPermissionEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('`sytem@user/error/ban`\n<:Moderator_Logo:1183460215782391828> **BAN** | Bot Permission Denied')
                .setDescription('The bot does not have permissions to ban members.');
            return message.reply({ embeds: [botNoPermissionEmbed] });
        }

        // Check if the member has a higher role than the bot
        if (target.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) {
            const roleHigherEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('`sytem@user/error/ban`\n<:Moderator_Logo:1183460215782391828> **BAN** | Role Hierarchy Issue')
                .setDescription("I can't ban this user due to their roles.");
            return message.reply({ embeds: [roleHigherEmbed] });
        }

        // Check if a reason for the ban is provided
        const reason = args.slice(1).join(' ') || 'Misbehavior';

        // Ban the user
        try {
            // Check if the user allows receiving private messages
            if (target.permissions.has("SEND_MESSAGES")) {
                // Send a private message to the banned user
                await target.send(`<:utilitybanhammer:1183420381734907947> **BANNED** | You have been banned from the server ${message.guild.name}.\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}\n\nIf you wish to appeal this ban, you can fill out this form. [BAN APPEAL](https://infolibros.org/libros-pdf-gratis/ingenieria/)`);
            } else {
                console.log(`The user ${target.user.tag} does not allow receiving private messages.`);
            }

            // Ban the user
            await target.ban({ reason });

            const banEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('`sytem@user/modlog/ban`\n<a:uh_stafflogo:1183420465902006273> Honie Studios | User Banned')
                .setDescription(`**Banned User:** ${target.user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}\n\nThe user has been banned.`);

            // Send the log to the logging channel
            const logChannel = message.guild.channels.cache.get(LOGS_CHANNEL_ID);

            if (logChannel && logChannel.type === 'text') {
                logChannel.send({ embeds: [banEmbed] });
            }

            // Record the ban in the database (using the Mongoose Ban model)
            const ban = new Ban({
                user_id: target.id,
                moderator_id: message.author.id,
                reason: reason,
            });

            await ban.save();

            message.reply({ embeds: [banEmbed] });
        } catch (error) {
            console.error("[CONSOLE ERROR]", error);
            const banErrorEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('`sytem@user/error/ban`\n<:utility8:1183420380501778514> **Error** | Ban Failed')
                .setDescription('An error occurred while trying to ban the user.');
            return message.reply({ embeds: [banErrorEmbed] });
        }
    },
};
