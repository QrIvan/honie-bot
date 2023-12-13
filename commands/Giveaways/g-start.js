// g-start.js

const { Client, Intents, MessageEmbed } = require('discord.js');
const GiveawaysManager = require('./giveaways');

// Define las intenciones necesarias
const intents = new Intents([
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    // ... Añade otras intenciones según tus necesidades
]);

const client = new Client({ intents });
const giveawaysManager = new GiveawaysManager(client);

// Resto del código...


module.exports = {
    name: 'g-start',
    category: 'Giveaways',
    aliases: ['giveaways', 'giveaway', 'event', 'e-start'],
    description: 'Starts a new giveaway.',
    usage: 'g-start <prize> <duration> [requiredRole]',
    run: async (client, message, args) => {
        // Verifica si el usuario tiene los permisos necesarios
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            const permissionErrorEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('Permission Denied')
                .setDescription('You do not have permissions to use this command.');

            return message.reply({ embeds: [permissionErrorEmbed] });
        }

        // Obtén el premio, la duración del mensaje y el rol requerido
        const prize = args[0];
        const duration = args[1];

        // Verifica si los argumentos son válidos
        if (!prize || !duration) {
            const argumentErrorEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('Invalid Command Usage')
                .setDescription('Please provide a prize and duration for the giveaway.');

            return message.reply({ embeds: [argumentErrorEmbed] });
        }

        // Intenta convertir la duración a milisegundos
        let durationMS = parseDuration(duration);
        if (durationMS === null) {
            const durationErrorEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('Invalid Duration')
                .setDescription('Invalid duration format. Use a format like "1h" for 1 hour.');

            return message.reply({ embeds: [durationErrorEmbed] });
        }

        // Crea el objeto del giveaway
        const giveawayData = {
            prize: prize,
            duration: durationMS,
            channelId: message.channel.id,
        };

        // Inicia el giveaway
        const giveaway = giveawaysManager.start(giveawayData);

        if (giveaway) {
            // Envía un mensaje informativo al canal de inicio del giveaway
            const embed = new MessageEmbed()
                .setTitle('🎉 Giveaway Started')
                .setDescription(`React with 🎉 to enter!\nPrize: **${prize}**\nDuration: **${duration}**`)
                .setColor('#0099ff')
                .setFooter(`Giveaway ID: ${giveaway.id}`);

            const giveawayChannel = client.channels.cache.get('1183246748836179979');
            giveawayChannel.send('<@&YOUR_ROLE_ID> <:FancyPepe:YOUR_EMOJI_ID>');
            giveawayChannel.send({ embeds: [embed] });
        } else {
            // Envía un mensaje de error si el sorteo no se generó correctamente
            const errorEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('Error Starting Giveaway')
                .setDescription('There was an error starting the giveaway. Please try again.');

            return message.reply({ embeds: [errorEmbed] });
        }
    },
};

// Función para convertir la duración a milisegundos
function parseDuration(duration) {
    const regex = /(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/;
    const matches = duration.match(regex);

    if (!matches) {
        return null;
    }

    const days = parseInt(matches[1]) || 0;
    const hours = parseInt(matches[2]) || 0;
    const minutes = parseInt(matches[3]) || 0;
    const seconds = parseInt(matches[4]) || 0;

    // Convierte a milisegundos
    const durationMS = (days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds) * 1000;

    return durationMS;
}
