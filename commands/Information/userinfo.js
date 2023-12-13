const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
  name: 'userinfo',
  category: "Information",
  aliases: ["urinfo", "infouser", "infome", "aboutme", "information"],
  description: 'Displays information about a user.',
  usage: 'h/userinfo [@user|ID]',
  examples: ["userinfo @QrIvan", "urinfo 828991790324514887"],
  run: async (client, message, args, prefix) => {
    const user = message.mentions.users.first() || message.author;
    const member = message.guild.members.cache.get(user.id);

    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('`sytem@user/@discord/information`\n📂 **|** User Information')
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addField('User ID', user.id, true)
      .addField('Nickname', member ? member.displayName : 'N/A', true)
      .addField('Join Date', member ? member.joinedAt.toLocaleDateString() : 'N/A', true)
      .addField('Creation Date', user.createdAt.toLocaleDateString(), true)
      .addField('Roles', member ? member.roles.cache.map((role) => role.toString()).join(' ') : 'N/A')
      .setFooter(`By ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
}
