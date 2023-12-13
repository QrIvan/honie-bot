const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'poll',
    category: 'Admin',
    aliases: ['encuesta'],
    description: 'Submit a Survey in the survey channel.',
    usage: 'poll <poll>',
    examples: ['poll What do you prefer Water or Milk?'],
    run: async (client, message, args, prefix) => {
        // Definir el ID del canal de encuestas como una constante
        const pollChannelID = '1183472766582784030';

        if (!message.member.permissions.has('ADMINISTRATOR')) {
            const permissionEmbed = new MessageEmbed()
                .setColor('RED')
                .setTitle('`sytem@user/error/poll`\n<:Moderator_Logo:1183460215782391828> **POLL** | Permission Denied')
                .setDescription('You do not have permissions to use this command.');

            return message.reply({ embeds: [permissionEmbed] });
        }

        const encuesta = args.join(' ');

        if (!encuesta) {
            const usageEmbed = new MessageEmbed()
                .setColor('RED')
                .setTitle('`sytem@user/error/poll`\n<:Moderator_Logo:1183460215782391828> **POLL** | Valid Use')
                .setDescription('Valid use: `h/poll [poll]`.');

            return message.reply({ embeds: [usageEmbed] });
        }

        // Obtener el canal de encuestas por su ID
        const pollChannel = message.guild.channels.cache.get(pollChannelID);

        try {
            pollChannel.send("<@&1183441455541387324>");

            const embed = new MessageEmbed()
                .setColor('GREEN')
                .setTitle('📊 | New survey')
                .setFooter(message.member.displayName, message.author.displayAvatarURL())
                .setDescription(`\`\`\`${encuesta}\`\`\``);

            // Enviar la Encuesta al canal de Encuestas
            pollChannel.send({ embeds: [embed] }).then(sentMessage => {
                // Añadir reacciones para votar en la Encuesta (opcional)
                sentMessage.react('<:utility12:1183420388580012094>');
                sentMessage.react('<:utility8:1183420380501778514>');

                // Responder con la confirmación
                const confirmationEmbed = new MessageEmbed()
                    .setColor('GREEN')
                    .setTitle('`sytem@user/newpoll`\n<:utility12:1183420388580012094> **POLL** | Poll Sent')
                    .setDescription('The survey has been put to the vote.');

                message.reply({ embeds: [confirmationEmbed] });
            });
        } catch (error) {
            console.error('[CONSOLE ERROR] Error al enviar la encuesta:', error);
            const errorEmbed = new MessageEmbed()
                .setColor('RED')
                .setTitle('`sytem@user/error/poll`\n<:Moderator_Logo:1183460215782391828> **POLL** | Error')
                .setDescription('An error occurred while sending the survey. Please try again later.');

            message.reply({ embeds: [errorEmbed] });
        }
    },
};
