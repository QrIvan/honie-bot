const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('🏓 Displays the bot and Discord API latency.'),
    async run(client, interaction) {
        const botLatency = Date.now() - interaction.createdTimestamp;
        const apiLatency = Math.round(client.ws.ping);

        const response = `🏓 Pong!\nBot Latency: ${botLatency}ms\nDiscord API Latency: ${apiLatency}ms`;

        await interaction.reply({ content: response, ephemeral: true });
    },
};
