const { MessageEmbed, Permissions } = require('discord.js');
const Ban = require('..//..//database/models/banModel');
const LOGS_CHANNEL_ID = 'LOGS_CHANNEL_ID';

module.exports = {
    name: 'ban',
    category: 'Moderation',
    aliases: [],
    description: 'Ban a member from the server.',
    usage: 'ban @user|ID [reason]',
    examples: ["ban @QrIvan Testing", "ban 828991790324514887 Testing"],
    run: async (client, message, args) => {
        if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            const noPermissionEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('**BAN** | Permission Denied')
                .setDescription('You do not have permissions to use this command.');
            return message.reply({ embeds: [noPermissionEmbed] });
        }

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
                .setTitle('**BAN** | Invalid User')
                .setDescription('Valid use: `h/ban [@user|user_id] [reason]`.');
            return message.reply({ embeds: [invalidUserEmbed] });
        }

        if (!message.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            const botNoPermissionEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('**BAN** | Bot Permission Denied')
                .setDescription('The bot does not have permissions to ban members.');
            return message.reply({ embeds: [botNoPermissionEmbed] });
        }

        if (target.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) {
            const roleHigherEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('**BAN** | Role Hierarchy Issue')
                .setDescription("I can't ban this user due to their roles.");
            return message.reply({ embeds: [roleHigherEmbed] });
        }

        const reason = args.slice(1).join(' ') || 'Misbehavior';

        try {
            if (target.permissions.has("SEND_MESSAGES")) {
                await target.send(`**BANNED** | You have been banned from the server ${message.guild.name}.\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}\n\nIf you wish to appeal this ban, you can fill out this form. [BAN APPEAL](https://rebrand.ly/folkdiscord)`);
            } else {
                console.log(`The user ${target.user.tag} does not allow receiving private messages.`);
            }

            await target.ban({ reason });

            const banEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('Honie Studios | User Banned')
                .setDescription(`**Banned User:** ${target.user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}\n\nThe user has been banned.`);

            const logChannel = message.guild.channels.cache.get(LOGS_CHANNEL_ID);

            if (logChannel && logChannel.type === 'text') {
                logChannel.send({ embeds: [banEmbed] });
            }

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
                .setTitle('**Error** | Ban Failed')
                .setDescription('An error occurred while trying to ban the user.');
            return message.reply({ embeds: [banErrorEmbed] });
        }
    },
};
