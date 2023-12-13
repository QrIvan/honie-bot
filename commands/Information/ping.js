const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ping',
    category: "Information",
    aliases: [], 
    description: "Check the bot's latency and response time.",
    usage: "ping",
    examples: ["ping"],
    run: async (client, message, args, prefix) => {
        const pingMessage = await message.reply({ content: "🏓 Pinging..." });

        const latency = pingMessage.createdTimestamp - message.createdTimestamp;
        const wsPing = client.ws.ping;

        const embed = new MessageEmbed()
            .setTitle("🏓 Ping")
            .setColor('#3498db')
            .addField("Latency", `${latency}ms`, true)
            .addField("WebSocket Ping", `${wsPing}ms`, true)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());

        pingMessage.edit({ content: '\u200B', embeds: [embed] });
    }
};
