const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'botinfo',
    category: 'Information',
    aliases: ['infobot', 'botgeneral', 'stats'],
    description: 'Show the Bot information',
    usage: 'botinfo',
    examples: ["botinfo"],
    run: async (client, message, args) => {

        const botVersion = '**v1.0.5**';
        const devInfo = '[QrIvan#0105](https://github.com/QrIvan)';

        const botInfoEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle('`sytem@bot/information`\n📂 **|** Bot Information')
            .addField(' | Developers', devInfo, true)
            .addField(' | Bot Version', botVersion, true)
            .addField(' | Members', client.users.cache.size.toString(), true)
            .addField(' | Activity time', formatUptime(process.uptime()), true)
            .setFooter('Thanks for using our bot!');

        message.reply({ embeds: [botInfoEmbed] });
    },
};

function formatUptime(uptime) {
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime % 3600) / 60);
    const hours = Math.floor(uptime / 3600);

    return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
}
