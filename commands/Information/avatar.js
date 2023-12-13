const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'avatar',
    category: 'Information',
    aliases: ["av"],    
    description: 'Shows a user(s) avatar.',
    examples: ["avatar @QrIvan", "av 828991790324514887"],
    usage: 'avatar  @Member|ID',
    run: async (client, message, args) => {
        // Obtén al usuario mencionado o al autor del mensaje
        const user = message.mentions.users.first() || message.author;

        // Obtén la URL del avatar del usuario
        const avatarURL = user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 });

        // Crea un mensaje embed con el avatar
        const avatarEmbed = new MessageEmbed()
            .setTitle(`Avatar of ${user.tag}`)
            .setColor('#0099ff')
            .setImage(avatarURL)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());

        // Envía el mensaje embed
        message.reply({ embeds: [avatarEmbed] });
    },
};
