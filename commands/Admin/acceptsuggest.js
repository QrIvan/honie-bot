const { MessageEmbed, TextChannel } = require('discord.js');
const Sugerencia = require('../../database/models/sugerenciaModel');
const suggestionChannelID = 'suggestionChannelID'; // Reemplaza con el ID del canal de sugerencias

module.exports = {
    name: 'acceptsuggest',
    category: 'Admin',
    aliases: ['accept'],
    description: 'Accept a suggestion.',
    usage: 'acceptsuggest [suggestionID]',
    run: async (client, message, args) => {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            const noPermissionEmbed = new MessageEmbed()
                .setColor('RED')
                .setTitle('**SUGGESTION** | **Permission Error**')
                .setDescription('You do not have permissions to use this command.');

            return message.reply({ embeds: [noPermissionEmbed] });
        }

        const suggestionID = args[0];

        if (!suggestionID) {
            const embed = new MessageEmbed()
                .setColor('RED')
                .setTitle('**SUGGESTION** | Missing Error')
                .setDescription('Valid use: `h/acceptsuggest [ID]`.');

            return message.reply({ embeds: [embed] });
        }

        try {
            const sugerencia = await Sugerencia.findOne({ id: suggestionID });

            if (!sugerencia) {
                const notFoundEmbed = new MessageEmbed()
                    .setColor('ORANGE')
                    .setTitle('**SUGGESTION** | Missing Information')
                    .setDescription('Suggestion with the provided ID does not exist.');

                return message.reply({ embeds: [notFoundEmbed] });
            }

            if (sugerencia.estado !== 'Voting') {
                const alreadyAcceptedEmbed = new MessageEmbed()
                    .setColor('ORANGE')
                    .setTitle('**SUGGESTION** | Error Accept')
                    .setDescription('This suggestion has already been accepted or denied.');

                return message.reply({ embeds: [alreadyAcceptedEmbed] });
            }

            sugerencia.estado = 'Accept';
            await sugerencia.save();

            const suggestionChannel = message.guild.channels.cache.get(suggestionChannelID);
            if (suggestionChannel instanceof TextChannel) {
                const suggestionMessage = await suggestionChannel.messages.fetch(sugerencia.messageId);
                if (suggestionMessage) {
                    const acceptEmbed = new MessageEmbed()
                        .setColor('GREEN')
                        .setTitle('Suggestion Accepted')
                        .addFields(
                            { name: 'Original Suggestion ID', value: sugerencia.id },
                            { name: 'Suggestion', value: sugerencia.contenido },
                            { name: 'From', value: sugerencia.autor }
                        )
                        .setTimestamp();

                    suggestionChannel.send({ embeds: [acceptEmbed] });

                    suggestionMessage.delete();

                    const successEmbed = new MessageEmbed()
                        .setColor('GREEN')
                        .setTitle('**SUGGESTION** | Suggestion Accept')
                        .setDescription('The suggestion has been accepted.')
                        .setTimestamp();

                    message.reply({ embeds: [successEmbed] });
                }
            }
        } catch (error) {
            console.error('[CONSOLE ERROR] Error accepting suggestion:', error);
            const errorEmbed = new MessageEmbed()
                .setColor('RED')
                .setTitle('**SUGGESTION** | Error')
                .setDescription('An error occurred while accepting the suggestion. Please try again.')
                .setTimestamp();

            message.reply({ embeds: [errorEmbed] });
        }
    },
};
