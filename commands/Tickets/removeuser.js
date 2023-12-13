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
 
        const roleIDsToSearch = ['1183419688705867777', '1183246663448531006', '1183246662605471796'];

        const rolesFound = [];

        roleIDsToSearch.forEach(roleID => {
            const role = member.roles.cache.get(roleID);
            if (role) {
                rolesFound.push(role);
            }
        });

        // Check if the member has administrator permissions
        const isAdmin = member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);

        // Check if the member has any of the specified roles or administrator permissions
        if (rolesFound.length === 0 && !isAdmin) {
            const noPermissionEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('`sytem@user/perms/tickets`\n<:Moderator_Logo:1183460215782391828> **TICKETS** | Permission Denied')
                .setDescription('You do not have permissions to use this command.');
            return message.reply({ embeds: [noPermissionEmbed] });
        }


        // Check if a valid user ID was provided
        const userId = args[0];
        const mentionedUser = client.users.cache.get(userId);

        if (!mentionedUser) {
            const invalidUserIdEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('`sytem@user/error/tickets`\n<:Moderator_Logo:1183460215782391828> **TICKETS** | Invalid User ID')
                .setDescription('Valid use: `h/removeuser [userID]`.');
            return message.reply({ embeds: [invalidUserIdEmbed] });
        }

        // Update channel permissions to prevent the removed user from viewing, sending messages, and reading message history
        message.channel.permissionOverwrites.edit(mentionedUser, {
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false,
            READ_MESSAGE_HISTORY: false
        });

        // Confirmation message in the text channel
        const confirmationEmbed = new MessageEmbed()
            .setColor('#00ff00')
            .setTitle('`sytem@user/confirm/tickets`\n<:utility12:1183420388580012094> **TICKETS** | User Removed')
            .setDescription(`The user ${mentionedUser.tag} has been removed from the ticket.`);
        message.reply({ embeds: [confirmationEmbed] });

        // Notify the removed user via DM
        mentionedUser.send(`<a:uh_stafflogo:1183420465902006273> **TICKETS** | You have been removed from the ticket in **${message.guild.name}**: ${message.channel.name}`);
    },
};
