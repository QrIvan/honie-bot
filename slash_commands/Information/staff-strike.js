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

        const reasonOption = interaction.options.getString('reason');
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return interaction.reply('You do not have permission to use this command.');
        }

        const user = interaction.options.getMember('user');
        const reason = reasonOption ? reasonOption : 'Unknown Reason'; //En caso de que no sirva la reason o haya un error.

        const embed = new MessageEmbed()
            .setColor('#00ff00')
            .setTitle('💼 Staff Warned | New Strike')
            .setDescription(`${user} **has been warned by** > (${reason})`);

        await interaction.reply({ embeds: [embed] });
    },
};
