const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'perks',
    category: 'Information',
    aliases: ['ranks', 'inforanks', 'rankinformation'],
    description: 'Displays the benefits of being a Partner and Customer.',
    usage: 'perks',
    run: async (client, message, args) => {
        // Define benefits for each rank
        const benefits = {
            Customer: [
                '→ Create public threads.',
                '→ Discounts on future purchases.',
                '→ Use application commands in general chats.',
                '→ Add reactions.',
                '→ Attach **Images/Videos** in general chats.',
                '→ Attach **Stickers** from other servers.',
                '→ Attach emojis from other servers.',
                '→ More benefits coming soon...'
            ],
            Creator: [
                '→ All **Customer** benefits.',
                '→ Create private threads.',
                '→ Promote your server as an affiliate of Honie Studios.',
                '→ Many discounts on our products.',
                '→ More benefits coming soon...'
            ],
        };

        // Create a selection menu component
        const selectMenu = new MessageSelectMenu()
            .setCustomId('menu-perks')
            .setPlaceholder('🧷・Click to select your rank.');

        // Add options to the menu for each rank
        for (const rank in benefits) {
            selectMenu.addOptions([
                {
                    label: rank,
                    value: rank,
                    description: `View benefits for ${rank}`,
                },
            ]);
        }

        // Create an action row with the selection menu
        const row = new MessageActionRow().addComponents(selectMenu);

        // Create an embed for the initial message
        const initialEmbed = new MessageEmbed()
            .setTitle('👻・➥ Rank Benefits')
            .setColor('RANDOM')
            .setDescription('Select your rank from the menu below to view the corresponding benefits.');

        // Send the initial message with the menu
        await message.reply({ embeds: [initialEmbed], components: [row] });

        // Event handler to handle menu selection
        const filter = (interaction) =>
            interaction.isSelectMenu() && interaction.customId === 'menu-perks';

        const collector = message.channel.createMessageComponentCollector({
            filter,
            time: 60000, // Timeout in milliseconds (60 seconds in this case)
        });

        collector.on('collect', async (interaction) => {
            const selectedOption = interaction.values[0];

            // Check if the selected rank exists in benefits
            if (benefits[selectedOption]) {
                const rankBenefits = benefits[selectedOption];

                // Create an embed message with the rank benefits
                const rankEmbed = new MessageEmbed()
                    .setTitle(`👻・${selectedOption} Benefits`)
                    .setColor('RANDOM')
                    .setDescription(rankBenefits.join('\n'));

                // Respond to the user with the embed message
                interaction.reply({ embeds: [rankEmbed], ephemeral: true });
            } else {
                // If the rank does not exist in benefits
                interaction.reply({ content: 'No benefits found for this rank.', ephemeral: true });
            }
        });
        collector.on('end', (collected) => {
            if (collected.size === 0) {
                const timeoutEmbed = new MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle('`sytem@user/@discord/information`\n<a:ZLogoTTM:1183420434843181126> **Perks** | Time Ran Out')
                    .setDescription('You ran out of time to select a rank.');
                message.reply({ embeds: [timeoutEmbed] });
            }
        });
    }
}