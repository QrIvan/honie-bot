const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    name: 'removeuser',
    category: 'Tickets',
    aliases: ['ticketremove'],
    description: 'Remove a user from the ticket by user ID.',
    usage: 'removeuser <User ID>',
    examples: ['removeuser 828991790324514887'],
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
            const invalidUserIdEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('**TICKETS** | Invalid User ID')
                .setDescription('Valid use: `h/removeuser [userID]`.');
            return message.reply({ embeds: [invalidUserIdEmbed] });
        }

        message.channel.permissionOverwrites.edit(mentionedUser, {
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false,
            READ_MESSAGE_HISTORY: false
        });

        const confirmationEmbed = new MessageEmbed()
            .setColor('#00ff00')
            .setTitle('**TICKETS** | User Removed')
            .setDescription(`The user ${mentionedUser.tag} has been removed from the ticket.`);
        message.reply({ embeds: [confirmationEmbed] });

        // Notify the removed user via DM
        mentionedUser.send(`<a:uh_stafflogo:1183420465902006273> **TICKETS** | You have been removed from the ticket in **${message.guild.name}**: ${message.channel.name}`);
    },
};
