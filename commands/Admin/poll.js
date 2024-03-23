const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'poll',
    category: 'Admin',
    aliases: ['encuesta'],
    description: 'Submit a Survey in the survey channel.',
    usage: 'poll <poll>',
    examples: ['poll What do you prefer Water or Milk?'],
    run: async (client, message, args, prefix) => {
        const pollChannelID = 'pollChannelID';

        if (!message.member.permissions.has('ADMINISTRATOR')) {
            const permissionEmbed = new MessageEmbed()
                .setColor('RED')
                .setTitle('**POLL** | Permission Denied')
                .setDescription('You do not have permissions to use this command.');

            return message.reply({ embeds: [permissionEmbed] });
        }

        const encuesta = args.join(' ');

        if (!encuesta) {
            const usageEmbed = new MessageEmbed()
                .setColor('RED')
                .setTitle('**POLL** | Valid Use')
                .setDescription('Valid use: `h/poll [poll]`.');

            return message.reply({ embeds: [usageEmbed] });
        }

        const pollChannel = message.guild.channels.cache.get(pollChannelID);

        try {
            pollChannel.send("<@&POLL_TAG>");

            const embed = new MessageEmbed()
                .setColor('GREEN')
                .setTitle('📊 | New survey')
                .setFooter(message.member.displayName, message.author.displayAvatarURL())
                .setDescription(`\`\`\`${encuesta}\`\`\``);

            pollChannel.send({ embeds: [embed] }).then(sentMessage => {
                sentMessage.react('⭐');
                sentMessage.react('🔨');

                const confirmationEmbed = new MessageEmbed()
                    .setColor('GREEN')
                    .setTitle('**POLL** | Poll Sent')
                    .setDescription('The survey has been put to the vote.');

                message.reply({ embeds: [confirmationEmbed] });
            });
        } catch (error) {
            console.error('[CONSOLE ERROR] Error al enviar la encuesta:', error);
            const errorEmbed = new MessageEmbed()
                .setColor('RED')
                .setTitle('**POLL** | Error')
                .setDescription('An error occurred while sending the survey. Please try again later.');

            message.reply({ embeds: [errorEmbed] });
        }
    },
};
