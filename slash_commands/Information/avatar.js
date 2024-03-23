const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('👻 Show the avatar of a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('👥 The user whose avatar you want to see.')
        ),
        async run(client, interaction) {
        const user = interaction.options.getUser('user') || interaction.user;

        const avatarURL = user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 });
        const avatarEmbed = new MessageEmbed()
            .setTitle(`Avatar of ${user.tag}`)
            .setColor('#0099ff')
            .setImage(avatarURL)
            .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
            .setTimestamp();
        await interaction.reply({ embeds: [avatarEmbed] });
    },
};
