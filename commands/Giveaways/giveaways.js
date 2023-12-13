const { Client, MessageEmbed } = require('discord.js');

class GiveawaysManager {
    constructor(client, options = {}) {
        this.client = client;
        this.options = {
            default: {
                reaction: '🎉',
                timeout: 60000,
                winners: 1,
            },
            ...options,
        };
        this.giveaways = new Map();
        this.initListeners();
    }

    initListeners() {
        this.client.on('messageReactionAdd', this.handleReaction.bind(this));
    }

    async handleReaction(reaction, user) {
        if (user.bot) return;

        const giveaway = this.giveaways.get(reaction.message.id);
        if (!giveaway) return;

        if (reaction.emoji.name === this.options.default.reaction) {
            if (!giveaway.entries.includes(user.id)) {
                giveaway.entries.push(user.id);
            }
        }
    }

    async start(options) {
        const {
            prize,
            duration,
            channelId,
            reaction = this.options.default.reaction,
            timeout = this.options.default.timeout,
            winners = this.options.default.winners,
        } = options;

        const embed = new MessageEmbed()
            .setTitle(`🎉 Giveaway: ${prize}`)
            .setDescription(`React with ${reaction} to enter!\nTime: ${duration / 1000} seconds\nWinners: ${winners}`)
            .setColor('#0099ff')
            .setFooter('Honie Studios | Giveaways Sytem');

        const channel = this.client.channels.cache.get(channelId);

        if (!channel) {
            console.error(`[CONSOLE ERROR] Channel with ID ${channelId} not found`);
            return null;  // Return null or handle the error accordingly
        }

        try {
            const message = await channel.send({ embeds: [embed] });
            await message.react(reaction);

            const giveaway = {
                id: message.id,
                prize,
                duration,
                channelId,
                reaction,
                timeout,
                winners,
                entries: [],
            };

            this.giveaways.set(message.id, giveaway);

            setTimeout(() => this.end(message.id), duration);

            return giveaway;
        } catch (error) {
            console.error('[CONSOLE ERROR] Error starting giveaway:', error);
            return null;  // Return null or handle the error accordingly
        }
    }
}