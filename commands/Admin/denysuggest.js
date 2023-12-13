const { MessageEmbed, TextChannel } = require('discord.js');
const Sugerencia = require('../../database/models/sugerenciaModel'); // Importa el modelo de sugerencia
const suggestionChannelID = '1183246713901817916'; // Reemplaza con el ID del canal de sugerencias

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
                .setTitle('`sytem@user/perms/suggest`\n<:Moderator_Logo:1183460215782391828> **SUGGESTION** | **Permission Error**')
                .setDescription('You do not have permissions to use this command.');

            return message.reply({ embeds: [noPermissionEmbed] });
        }

        const suggestionID = args[0];

        if (!suggestionID) {
            const embed = new MessageEmbed()
                .setColor('RED')
                .setTitle('`sytem@user/error/suggest`\n<:Moderator_Logo:1183460215782391828> **SUGGESTION** | Missing Error')
                .setDescription('Valid use: `h/denysuggest [ID]`.');

            return message.reply({ embeds: [embed] });
        }

        try {
            const sugerencia = await Sugerencia.findOne({ id: suggestionID });

            if (!sugerencia) {
                const notFoundEmbed = new MessageEmbed()
                    .setColor('ORANGE')
                    .setTitle('`sytem@user/error/suggest`\n<:Moderator_Logo:1183460215782391828> **SUGGESTION** | Not Found')
                    .setDescription('Suggestion with the provided ID does not exist.');

                return message.reply({ embeds: [notFoundEmbed] });
            }

            if (sugerencia.estado !== 'Voting') {
                const alreadyAcceptedEmbed = new MessageEmbed()
                    .setColor('ORANGE')
                    .setTitle('`sytem@user/error/suggest`\n<:Moderator_Logo:1183460215782391828> **SUGGESTION** | Error Deny')
                    .setDescription('This suggestion has already been accepted or denied.');

                return message.reply({ embeds: [alreadyAcceptedEmbed] });
            }

            sugerencia.estado = 'Deny'; // Cambia el estado a "Deny"

            // Aumenta el contador de votos en contra
            sugerencia.votosEnContra += 1;

            await sugerencia.save();

            // Obtén el mensaje original de la sugerencia en el canal de sugerencias
            const suggestionChannel = message.guild.channels.cache.get(suggestionChannelID);
            if (suggestionChannel instanceof TextChannel) {
                const suggestionMessage = await suggestionChannel.messages.fetch(sugerencia.messageId);
                if (suggestionMessage) {
                    // Enviar un mensaje al canal de sugerencias con la nueva sugerencia denegada
                    const denyEmbed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle('<:utility8:1183420380501778514> Suggestion Denied')
                        .addFields(
                            { name: 'Original Suggestion ID', value: sugerencia.id },
                            { name: 'Suggestion', value: sugerencia.contenido },
                            { name: 'From', value: sugerencia.autor }
                        )
                        .setTimestamp();

                    suggestionChannel.send({ embeds: [denyEmbed] });

                    // Eliminar el mensaje original de la sugerencia
                    suggestionMessage.delete();

                    const successEmbed = new MessageEmbed()
                        .setColor('GREEN')
                        .setTitle('`sytem@user/deny/suggest`\n<:utility12:1183420388580012094> **SUGGESTION** | Suggestion Denied')
                        .setDescription('The suggestion has been denied.')
                        .setTimestamp();

                    message.reply({ embeds: [successEmbed] });
                }
            }
        } catch (error) {
            console.error('[CONSOLE ERROR] Error denying suggestion:', error);
            const errorEmbed = new MessageEmbed()
                .setColor('RED')
                .setTitle('`sytem@user/deny/suggest`\n<:Moderator_Logo:1183460215782391828> **SUGGESTION** | Error')
                .setDescription('An error occurred while denying the suggestion. Please try again.');

            message.reply({ embeds: [errorEmbed] });
        }
    },
};
