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

        const ticketChannel = message.channel;

        if (!ticketChannel.name.startsWith('ticket-')) {
            const invalidTicketEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('**TICKETS** | Invalid Command')
                .setDescription('This command can only be executed in a ticket channel.');
            return message.reply({ embeds: [invalidTicketEmbed] });
        }

        const user = getUserFromChannelName(message.guild, ticketChannel.name);

        if (!user) {
            const userNotFoundEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('**TICKETS** | User Not Found')
                .setDescription('The user associated with this ticket could not be determined.');
            return message.reply({ embeds: [userNotFoundEmbed] });
        }

        const confirmationEmbed = new MessageEmbed()
            .setTitle('Ticket Closure Confirmation')
            .setDescription(`React with EMOJI to confirm the closure of the ticket for ${user.id}.`)
            .setColor('#ff0000')
            .setFooter('Honie Studios | Ticket System');

        const confirmationMessage = await message.reply({ embeds: [confirmationEmbed] });

        confirmationMessage.react('🔨');

        const filter = (reaction, user) => reaction.emoji.name === '🔨' && user.id === message.author.id;
        const collector = confirmationMessage.createReactionCollector({ filter, time: 15000 });

        collector.on('collect', async () => {
            confirmationMessage.delete().catch(console.error);
            const messages = await ticketChannel.messages.fetch();
            const transcript = messages
                .filter(msg => msg.type === 'DEFAULT')
                .map(msg => `${msg.author.tag}: ${msg.content}`)
                .join('\n');

            const fileName = `transcript-${user.id}.txt`;
            fs.writeFileSync(fileName, transcript);
            const userDM = await user.createDM();
            const transcriptEmbed = new MessageEmbed()
                .setTitle('📋 | Support Ticket Transcript')
                .setDescription(`Here is the transcript of your support ticket at Honie Studios`)
                .setColor('#3498db');

            userDM.send({ embeds: [transcriptEmbed], files: [fileName] });

            setTimeout(() => {
                ticketChannel.delete().catch(console.error);
                fs.unlinkSync(fileName);
            }, 10000);

            const closureConfirmationEmbed = new MessageEmbed()
                .setColor('#00ff00')
                .setTitle('Ticket Closed')
                .setDescription(`The ticket has been closed, and the transcript has been sent to the member.`);

            message.reply({ embeds: [closureConfirmationEmbed] });
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                const timeoutEmbed = new MessageEmbed()
                    .setColor('#ff0000')
                    .setTitle('Timeout')
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
