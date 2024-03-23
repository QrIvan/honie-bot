const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    name: 'unlock',
    category: 'Moderation',
    aliases: [],
    description: 'Unlocks the current channel or a mentioned channel.',
    usage: 'unlock',
    examples: ["unlock"],
    run: async (client, message, args) => {

        const member = message.guild.members.cache.get(message.author.id);

        if (
            !member.permissions.has("MANAGE_CHANNELS") &&
            !message.member.roles.cache.has('ROL_ADMIN')
        ) {
            const noPermissionEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('**LOCK CHANNEL** | Permission Denied')
                .setDescription('You do not have permissions to use this command.');
            return message.reply({ embeds: [noPermissionEmbed] });
        }

        const channel = message.mentions.channels.first() || message.channel;

        const rolesToAllowSendMessages = [
            'ROL_USER',
            'ROL_USER',
            'ROL_USER',
        ];

        rolesToAllowSendMessages.forEach((roleId) => {
            const role = message.guild.roles.cache.get(roleId);
            if (role) {
                channel.permissionOverwrites.edit(role, {
                    SEND_MESSAGES: true,
                });
            }
        });

        const unlockEmbed = new MessageEmbed()
            .setColor('GREEN')
            .setDescription(`Channel ${channel} has been **unlocked**.`);

        message.reply({ embeds: [unlockEmbed] });
    },
};
