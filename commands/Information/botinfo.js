const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'botinfo',
    category: 'Information',
    aliases: ['infobot', 'botgeneral', 'stats'],
    description: 'Show the Bot information',
    usage: 'botinfo',
    examples: ["botinfo"],
    run: async (client, message, args) => {

        // Obtén la versión actual del bot y la lista de comandos
        const botVersion = '**v1.0.5**'; // Reemplaza esto con la versión real de tu bot
        const devInfo = 'QrIvan#0105\nMr. Tom Kinane#3153';

        // Construye un mensaje embed con la información recopilada
        const botInfoEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle('`sytem@bot/information`\n📂 **|** Bot Information')
            .addField('<:2020_devlogo:1183420447291879574> | Developers', devInfo, true)
            .addField('<:Bot_Logo:1183460213496484053> | Bot Version', botVersion, true)
            .addField('<:users_logo:1183420445635133460> | Members', client.users.cache.size.toString(), true)
            .addField('<a:ZLogo3TTM:1183420441897996298> | Activity time', formatUptime(process.uptime()), true)
            .setFooter('Thanks for using our bot!');

        // Envía el mensaje embed al canal donde se invocó el comando
        message.reply({ embeds: [botInfoEmbed] });
    },
};

function formatUptime(uptime) {
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime % 3600) / 60);
    const hours = Math.floor(uptime / 3600);

    return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
}
