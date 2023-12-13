const { MessageEmbed, TextChannel } = require('discord.js');
const Sugerencia = require('..//..//database/models/sugerenciaModel'); // Importa el modelo de sugerencia
const { v4: uuidv4 } = require('uuid'); // Importa la función para generar UUID

const suggestionChannelID = '1183246713901817916'; // Reemplaza con el ID del canal de sugerencias

module.exports = {
    name: 'suggest',
    category: 'Support',
    aliases: ['sugerencia', 'sugerir'],
    description: 'Submit a suggestion to the server.',
    usage: 'suggest [suggestion]',
    run: async (client, message, args) => {
        const suggestion = args.join(' ');
        const user = message.mentions.users.first() || message.author;

        if (!suggestion) {
            const embed = new MessageEmbed()
                .setColor('RED')
                .setTitle('`sytem@user/error/suggest`\n<:Moderator_Logo:1183460215782391828> **SUGGESTION** | Missing Error')
                .setDescription('Valid use: `h/suggest [suggestion]`.')


            return message.reply({ embeds: [embed] });
        }

        const suggestionChannel = message.guild.channels.cache.get(suggestionChannelID);

        if (suggestionChannel instanceof TextChannel) {
            const suggestionID = generateUniqueID(); // Genera una ID única

            const suggestEmbed = new MessageEmbed()
                .setColor('#e6db13')
                .setTitle('<a:ZLogo4TTM:1183420453134532631> New Suggestion')
                .setDescription(`**Suggestion**: ${suggestion}\n\n**Identifier**: ${suggestionID}\n\n**Status**: Voting...`)
                .setFooter(`From: ${message.author.tag}`)
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setTimestamp();

            suggestionChannel.send({ embeds: [suggestEmbed] })
                .then(async (suggestionMessage) => {
                    suggestionMessage.react('<:utility12:1183420388580012094>'); // Emoji para aceptar
                    suggestionMessage.react('<:utility8:1183420380501778514>'); // Emoji para denegar

                    const successEmbed = new MessageEmbed()
                        .setColor('GREEN')
                        .setTitle('`sytem@user/new/suggest`\n<:utility12:1183420388580012094> **SUGGESTION** | Submitted')
                        .setDescription('Your suggestion has been submitted successfully. see more <#1183246713901817916>');

                    message.reply({ embeds: [successEmbed] });

                    // Almacena la sugerencia en la base de datos
                    const nuevaSugerencia = new Sugerencia({
                        id: suggestionID,
                        estado: 'Voting',
                        contenido: suggestion,
                        autor: message.author.tag, // Guarda el autor
                    });

                    try {
                        await nuevaSugerencia.save();
                        console.log('[CONSOLE LOG] Sugerencia almacenada en la base de datos');
                    } catch (error) {
                        console.error('[CONSOLE ERROR] Error al almacenar la sugerencia en la base de datos:', error);
                    }
                })
                .catch((error) => {
                    console.error('[CONSOLE ERROR] Error sending suggestion:', error);
                    const errorEmbed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle('`sytem@user/error/suggest`\n<:utility8:1183420380501778514> **SUGGESTION** | Error')
                        .setDescription('Failed to submit the suggestion. Please try again.');

                    message.reply({ embeds: [errorEmbed] });
                });
        } else {
            const channelErrorEmbed = new MessageEmbed()
                .setColor('ORANGE')
                .setTitle('`sytem@user/error/suggest`\n<:utility8:1183420380501778514> **SUGGESTION** | Channel Error')
                .setDescription('Suggestion channel not found. Please contact an administrator.')


            return message.reply({ embeds: [channelErrorEmbed] });
        }
    },
};

// Función para generar una ID única usando uuid
function generateUniqueID() {
    return uuidv4();
}
