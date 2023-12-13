const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('staff-strike')
        .setDescription('🔧 Warn a staff')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('👮 The Member to Warn')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('📕 The reason for the warn')
                .setRequired(true)),
    async run(client, interaction) {

        // Obtén las elecciones desde las opciones y asígnales las elecciones definidas
        const reasonOption = interaction.options.getString('reason');

        // Check if the user has ADMINISTRATOR permission
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return interaction.reply('You do not have permission to use this command.');
        }

        const user = interaction.options.getMember('user');
        const reason = reasonOption ? reasonOption : 'Unknown Reason'; // Fallback to 'Unknown Reason' if the selected reason is not found

        const embed = new MessageEmbed()
            .setColor('#00ff00')
            .setTitle('`sytem@user/staffmember/strike`\n💼 Staff Warned | New Strike')
            .setDescription(`${user} **has been warned by** > (${reason})`);

        await interaction.reply({ embeds: [embed] });
    },
};
