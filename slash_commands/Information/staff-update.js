const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions, GatewayIntentBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('staff-update')
		.setDescription('📡 Update staff roles for a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('👥 The user to update roles for')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('📕 The reason for the update (Promote, Demote, Resign, Apply)')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('oldrank')
                .setDescription("⛔ The user's old rank")
                .setRequired(false))
        .addRoleOption(option =>
            option.setName('newrank')
                .setDescription('👮 The new rank to assign (default: Member)')
                .setRequired(false)),
    async run(client, interaction) {
        const reasonChoices = [
            { name: 'Apply', value: 'Apply' },
            { name: 'Promote', value: 'Promote' },
            { name: 'Demote', value: 'Demote' },
            { name: 'Resign', value: 'Resign' },
        ];

        interaction.options._hoistedOptions.find(opt => opt.name === 'reason').choices = reasonChoices;

        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return interaction.reply('You do not have permission to use this command.');
        }

        const user = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason');
        const oldRank = interaction.options.getRole('oldrank');
        const newRank = interaction.options.getRole('newrank');

        if (!user || !oldRank || !newRank) {
            return await interaction.reply('Invalid options. Please make sure to provide valid user, oldrank, and newrank.');
        }

        const userTag = user.user.tag;

        const embed = new MessageEmbed()
            .setColor('#00ff00')
            .setTitle('💼 Staff Update | New Update')
            .setDescription(`${user} **>** **(${reason})** **>** ${oldRank.toString()} **>** ${newRank.toString()}`);

        await interaction.reply({ embeds: [embed] });
    },
};
