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
            !message.member.roles.cache.has('1183419688705867777')
        ) {
            const noPermissionEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('`sytem@user/perms/unlock`\n<:Moderator_Logo:1183460215782391828> **LOCK CHANNEL** | Permission Denied')
                .setDescription('You do not have permissions to use this command.');
            return message.reply({ embeds: [noPermissionEmbed] });
        }

        const channel = message.mentions.channels.first() || message.channel;

        // Allow sending messages to specific roles
        const rolesToAllowSendMessages = [
            '1183246670549504030',
            '1183246671673577483',
            '1183246678766133298',
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
            .setDescription(`<:Moderator_Logo:1183460215782391828> **|** Channel ${channel} has been **unlocked**.`);

        message.reply({ embeds: [unlockEmbed] });
    },
};
