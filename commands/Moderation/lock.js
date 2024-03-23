const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    name: 'lock',
    category: 'Moderation',
    aliases: [],
    description: 'Locks the current channel or a mentioned channel.',
    usage: 'lock',
    examples: ["lock"],
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

        const overwrites = [
            {
                id: message.guild.id,
                deny: [Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.CONNECT],
            },
            {
                id: "ROL_USER",
                deny: [Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.CONNECT],
            },
            {
                id: "ROL_USER",
                deny: [Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.CONNECT],
            },
            {
                id: "ROL_USER",
                deny: [Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.CONNECT],
            },
        ];

        for (const overwrite of overwrites) {
            const role = message.guild.roles.cache.get(overwrite.id);
            if (role) {
                channel.permissionOverwrites.create(role, overwrite);
            }
        }

        const lockEmbed = new MessageEmbed()
            .setColor('RED')
            .setDescription(`The channel ${channel} has been **locked**.`);

        message.reply({ embeds: [lockEmbed] });
    },
};
