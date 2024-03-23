const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'avatar',
    category: 'Information',
    aliases: ["av"],    
    description: 'Shows a user(s) avatar.',
    examples: ["avatar @QrIvan", "av 828991790324514887"],
    usage: 'avatar  @Member|ID',
    run: async (client, message, args) => {
        const user = message.mentions.users.first() || message.author;
        const avatarURL = user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 });

        const avatarEmbed = new MessageEmbed()
            .setTitle(`Avatar of ${user.tag}`)
            .setColor('#0099ff')
            .setImage(avatarURL)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());

        message.reply({ embeds: [avatarEmbed] });
    },
};
