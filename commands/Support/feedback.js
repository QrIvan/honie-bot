const { MessageEmbed, TextChannel } = require('discord.js');

const feedbackChannelID = '1183246715298512988'; // Reemplaza con el ID del canal de feedback

module.exports = {
    name: 'feedback',
    category: 'Support',
    aliases: [],
    description: 'Submit feedback to the server.',
    usage: 'feedback [feedback]',
    run: async (client, message, args) => {
        const feedbackContent = args.join(' ');
        const user = message.mentions.users.first() || message.author;

        if (!feedbackContent) {
            const embed = new MessageEmbed()
                .setColor('RED')
                .setTitle('`sytem@user/error/feedback`\n<:Moderator_Logo:1183460215782391828> **FEEDBACK** | Missing Error')
                .setDescription('Valid use: `h/feedback [feedback]`.');

            return message.reply({ embeds: [embed] });
        }

        const feedbackChannel = message.guild.channels.cache.get(feedbackChannelID);

        if (feedbackChannel instanceof TextChannel) {
            const feedbackEmbed = new MessageEmbed()
                .setColor('#e6db13')
                .setTitle('<a:ZLogo4TTM:1183420453134532631> New Feedback')
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setDescription(`**Feedback**: ${feedbackContent}\n\n⤷ • Thank you for choosing our services! 🌟 We are delighted to have you with us. We will always strive to give you the best experience possible. If you have any questions or need assistance, don't hesitate to ask. We hope you have an amazing day!`)
                .setFooter(`From: ${message.author.tag}`)
                .setTimestamp();

            feedbackChannel.send({ embeds: [feedbackEmbed] })
                .then((feedbackMessage) => {
                    // Agrega las reacciones
                    feedbackMessage.react('🌟');

                    const successEmbed = new MessageEmbed()
                        .setColor('GREEN')
                        .setTitle('`sytem@user/new/feedback`\n<:utility12:1183420388580012094> **FEEDBACK** | Submitted')
                        .setDescription('Your feedback has been submitted successfully.');

                    message.reply({ embeds: [successEmbed] });
                })
                .catch((error) => {
                    console.error('[CONSOLE ERROR] Error sending feedback:', error);
                    const errorEmbed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle('`sytem@user/error/feedback`\n<:Moderator_Logo:1183460215782391828> **FEEDBACK** | Error')
                        .setDescription('Failed to submit the feedback. Please try again.');

                    message.reply({ embeds: [errorEmbed] });
                });
        } else {
            const channelErrorEmbed = new MessageEmbed()
                .setColor('ORANGE')
                .setTitle('`sytem@user/error/feedback`\n<:Moderator_Logo:1183460215782391828> **FEEDBACK** | Channel Error')
                .setDescription('Feedback channel not found. Please contact an administrator.');

            return message.reply({ embeds: [channelErrorEmbed] });
        }
    },
};
