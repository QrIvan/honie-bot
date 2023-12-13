const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('⤵️ Displays information about a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('👥 The user you want to get information about.')
        ),
    async run(client, interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setTitle('`sytem@user/@discord/information`\n📂 **|** User Information')
            .addField('User ID', user.id, true)
            .addField('Nickname', member ? member.displayName : 'N/A', true)
            .addField('Join Date', member ? member.joinedAt.toLocaleDateString() : 'N/A', true)
            .addField('Creation Date', user.createdAt.toLocaleDateString(), true)
            .addField('Roles', member ? member.roles.cache.map((role) => role.toString()).join(' ') : 'N/A')
            .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        interaction.reply({ embeds: [embed] });
    },
};
