const { MessageEmbed, TextChannel } = require('discord.js');
const Sugerencia = require('../../database/models/sugerenciaModel');
const suggestionChannelID = 'suggestionChannelID';

module.exports = {
    name: 'denysuggest',
    category: 'Admin',
    aliases: ['deny'],
    description: 'Deny a suggestion.',
    usage: 'denysuggest [suggestionID]',
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
                .setDescription('Valid use: `h/denysuggest [ID]`.');

            return message.reply({ embeds: [embed] });
        }

        try {
            const sugerencia = await Sugerencia.findOne({ id: suggestionID });

            if (!sugerencia) {
                const notFoundEmbed = new MessageEmbed()
                    .setColor('ORANGE')
                    .setTitle('**SUGGESTION** | Not Found')
                    .setDescription('Suggestion with the provided ID does not exist.');

                return message.reply({ embeds: [notFoundEmbed] });
            }

            if (sugerencia.estado !== 'Voting') {
                const alreadyAcceptedEmbed = new MessageEmbed()
                    .setColor('ORANGE')
                    .setTitle('**SUGGESTION** | Error Deny')
                    .setDescription('This suggestion has already been accepted or denied.');

                return message.reply({ embeds: [alreadyAcceptedEmbed] });
            }

            sugerencia.estado = 'Deny';
            sugerencia.votosEnContra += 1;

            await sugerencia.save();

            const suggestionChannel = message.guild.channels.cache.get(suggestionChannelID);
            if (suggestionChannel instanceof TextChannel) {
                const suggestionMessage = await suggestionChannel.messages.fetch(sugerencia.messageId);
                if (suggestionMessage) {
                    const denyEmbed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle('Suggestion Denied')
                        .addFields(
                            { name: 'Original Suggestion ID', value: sugerencia.id },
                            { name: 'Suggestion', value: sugerencia.contenido },
                            { name: 'From', value: sugerencia.autor }
                        )
                        .setTimestamp();

                    suggestionChannel.send({ embeds: [denyEmbed] });
                    suggestionMessage.delete();

                    const successEmbed = new MessageEmbed()
                        .setColor('GREEN')
                        .setTitle('**SUGGESTION** | Suggestion Denied')
                        .setDescription('The suggestion has been denied.')
                        .setTimestamp();

                    message.reply({ embeds: [successEmbed] });
                }
            }
        } catch (error) {
            console.error('[CONSOLE ERROR] Error denying suggestion:', error);
            const errorEmbed = new MessageEmbed()
                .setColor('RED')
                .setTitle('**SUGGESTION** | Error')
                .setDescription('An error occurred while denying the suggestion. Please try again.');

            message.reply({ embeds: [errorEmbed] });
        }
    },
};
