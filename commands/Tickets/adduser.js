const { Client, Message, Permissions, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'adduser',
    category: 'Tickets',
    aliases: ['ticketadd'],
    description: 'Add a user to the ticket by user ID.',
    usage: 'adduser <User ID>',
    examples: ["adduser 828991790324514887"],
    run: async (client, message, args) => {
        const member = message.member;
        const roleIDsToSearch = ['ROL_STAFF', 'ROL_STAFF', 'ROL_STAFF'];

        const rolesFound = [];

        roleIDsToSearch.forEach(roleID => {
            const role = member.roles.cache.get(roleID);
            if (role) {
                rolesFound.push(role);
            }
        });

        const isAdmin = member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);
        if (rolesFound.length === 0 && !isAdmin) {
            const noPermissionEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('**TICKETS** | Permission Denied')
                .setDescription('You do not have permissions to use this command.');
            return message.reply({ embeds: [noPermissionEmbed] });
        }
        const userId = args[0];
        const mentionedUser = client.users.cache.get(userId);

        if (!mentionedUser) {
            const invalidUserEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('**TICKETS** | Invalid User ID')
                .setDescription('Valid use: `h/adduser [userID]`.');
            return message.reply({ embeds: [invalidUserEmbed] });
        }

        message.channel.permissionOverwrites.edit(mentionedUser, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            READ_MESSAGE_HISTORY: true
        });

        const confirmationEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle('**TICKETS** | User Added')
            .setDescription(`User ${mentionedUser.tag} has been added to the ticket.`);

        message.reply({ embeds: [confirmationEmbed] });

        // Notify the user that they have been added to the ticket
        mentionedUser.send(`<a:uh_stafflogo:1183420465902006273> **TICKETS** | You have been added to the ticket in ${message.guild.name}: ${message.channel.name}`);
    },
};
