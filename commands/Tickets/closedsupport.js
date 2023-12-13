const { MessageEmbed, Permissions } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'supportclosed',
    category: 'Tickets',
    aliases: ["closed", "closedticket", "ticketclosed"],
    description: 'Close a support ticket.',
    usage: 'supportclosed',
    examples: ["closed"],
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

        const ticketChannel = message.channel;

        if (!ticketChannel.name.startsWith('ticket-')) {
            const invalidTicketEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('`sytem@user/error/tickets`\n<:Moderator_Logo:1183460215782391828> **TICKETS** | Invalid Command')
                .setDescription('This command can only be executed in a ticket channel.');
            return message.reply({ embeds: [invalidTicketEmbed] });
        }

        const user = getUserFromChannelName(message.guild, ticketChannel.name);

        if (!user) {
            const userNotFoundEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('`sytem@user/error/tickets`\n<:Moderator_Logo:1183460215782391828> **TICKETS** | User Not Found')
                .setDescription('The user associated with this ticket could not be determined.');
            return message.reply({ embeds: [userNotFoundEmbed] });
        }

        // Confirmation
        const confirmationEmbed = new MessageEmbed()
            .setTitle('`sytem@user/confirm/tickets`\n<:Moderator_Logo:1183460215782391828> | Ticket Closure Confirmation')
            .setDescription(`React with <:utility12:1183420388580012094> to confirm the closure of the ticket for ${user.id}.`)
            .setColor('#ff0000')
            .setFooter('Honie Studios | Ticket System');

        const confirmationMessage = await message.reply({ embeds: [confirmationEmbed] });

        confirmationMessage.react('<:utility12:1183420388580012094>');

        const filter = (reaction, user) => reaction.emoji.name === '<:utility12:1183420388580012094>' && user.id === message.author.id;
        const collector = confirmationMessage.createReactionCollector({ filter, time: 15000 }); // 15 seconds to react

        collector.on('collect', async () => {
            // Send the confirmation message first
            confirmationMessage.delete().catch(console.error);

            // Get the chat transcript from the ticket
            const messages = await ticketChannel.messages.fetch();
            const transcript = messages
                .filter(msg => msg.type === 'DEFAULT')
                .map(msg => `${msg.author.tag}: ${msg.content}`)
                .join('\n');

            // Save the transcript to a .txt file
            const fileName = `transcript-${user.id}.txt`;
            fs.writeFileSync(fileName, transcript);

            // Send the transcript to the user via DM in an embed
            const userDM = await user.createDM();
            const transcriptEmbed = new MessageEmbed()
                .setTitle('`sytem@user/transcript/tickets`\n📋 | Support Ticket Transcript')
                .setDescription(`Here is the transcript of your support ticket at Honie Studios`)
                .setColor('#3498db');

            userDM.send({ embeds: [transcriptEmbed], files: [fileName] });

            // Delete the ticket channel after 10 seconds
            setTimeout(() => {
                ticketChannel.delete().catch(console.error);
                fs.unlinkSync(fileName); // Delete the transcript file
            }, 10000); // 10 seconds

            const closureConfirmationEmbed = new MessageEmbed()
                .setColor('#00ff00')
                .setTitle('`sytem@user/confirm/tickets`\n<:utility12:1183420388580012094> **|** Ticket Closed')
                .setDescription(`The ticket has been closed, and the transcript has been sent to the member.`);

            message.reply({ embeds: [closureConfirmationEmbed] });
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                const timeoutEmbed = new MessageEmbed()
                    .setColor('#ff0000')
                    .setTitle('`sytem@user/timeout/tickets`\n⏰ **|** Timeout')
                    .setDescription('Response time expired. Ticket closure canceled.');

                message.reply({ embeds: [timeoutEmbed] });
                confirmationMessage.delete().catch(console.error);
            }
        });
    },
};

function getUserFromChannelName(guild, channelName) {
    const matches = channelName.match(/ticket-(\d+)-/);

    if (matches && matches.length >= 2) {
        const userId = matches[1];
        const user = guild.members.cache.get(userId);
        return user;
    }

    return null;
}
