const { MessageEmbed } = require('discord.js');

// Define a list of memes
const memes = [
  'https://www.reddit.com/r/memes/',
  'https://imgflip.com/api',
  // Add more meme URLs here
];

module.exports = {
  name: 'meme',
  category: 'Information',
  aliases: [],
  description: 'Displays a random meme.',
  usage: 'meme',
  examples: ["meme"],
  run: async (client, message, args) => {
    // Choose a random meme
    const randomMeme = memes[Math.floor(Math.random() * memes.length)];

    // Create an embed message with the meme
    const embed = new MessageEmbed()
      .setTitle('😄 Meme of the Day')
      .setImage(randomMeme)
      .setColor('#3498db');

    // Send the meme to the channel
    message.reply({ embeds: [embed] });
  },
};
