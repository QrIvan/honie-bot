const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');

module.exports = {
  name: 'guides',
  category: 'Support',
  aliases: ["helphandler", "handler", "handlerguide", "guidehandler", "helpmongodb", "mongodb", "mongodbguide", "guidemongodb", "mongodb"],
  description: 'Displays learning guides for MongoDB, Handlers, and JavaScript code snippets.',
  usage: 'guides',
  run: async (client, message, args) => {
    const selectMenu = new MessageSelectMenu()
      .setCustomId('menu-guides')
      .setPlaceholder('📚・ Click and select a category.');
    selectMenu.addOptions([
      {
        label: '🍃 MongoDB',
        value: 'mongodb',
        description: 'Guides and resources for MongoDB.',
      },
      {
        label: '🤖 Handlers',
        value: 'handlers',
        description: 'Guides and resources for Discord.js handlers.',
      },
      {
        label: '💻 JavaScript Code Snippets',
        value: 'js-code',
        description: 'Useful JavaScript code snippets from the internet.',
      },
      {
        label: '🔧 Coming Soon',
        value: 'coming',
        description: 'More guides coming soon.',
      },
    ]);

    const row = new MessageActionRow().addComponents(selectMenu);

    const initialEmbed = new MessageEmbed()
      .setTitle('📚・➥ Learning Guides')
      .setColor('RANDOM')
      .setDescription('Select a category from the menu below to view the learning guides and resources.');

    await message.reply({ embeds: [initialEmbed], components: [row] });

    const filter = (interaction) =>
      interaction.isSelectMenu() && interaction.customId === 'menu-guides';

    const collector = message.channel.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    collector.on('collect', async (interaction) => {
      const selectedOption = interaction.values[0];

      if (selectedOption === 'mongodb') {
        const mongodbEmbed = new MessageEmbed()
          .setTitle('🍃 MongoDB Guides')
          .setColor('RANDOM')
          .setDescription('Guides and resources for MongoDB:')
          .addField('Official MongoDB Documentation', '[Official Link](https://docs.mongodb.com/)')
          .addField('Installation of MongoDB', '[Official Link](https://docs.mongodb.com/manual/administration/install-community/)')
          .addField('Indexing Strategies', '[Official Link](https://docs.mongodb.com/manual/indexes/)')
          .addField('Basic Queries in MongoDB', '[Official Link](https://docs.mongodb.com/manual/crud/)')
          .addField('Aggregation Framework Basics', '[Official Link](https://docs.mongodb.com/manual/aggregation/)')
          .addField('Data Modeling in MongoDB', '[Official Link](https://docs.mongodb.com/manual/core/data-modeling-introduction/)')
          .addField('MongoDB University Courses', '[Official Link](https://university.mongodb.com/)')
          .addField('MongoDB Atlas Quick Start Guide', '[Official Link](https://docs.atlas.mongodb.com/getting-started/)')
          .addField('MongoDB Shell Commands Cheatsheet', '[Official Link](https://www.mongodb.com/developer/quickstart/cheat-sheet/)')
          .setFooter('Rights © These documents do not belong to Honie Studios');

        interaction.reply({ embeds: [mongodbEmbed], ephemeral: true });
      } else if (selectedOption === 'handlers') {
        const handlersEmbed = new MessageEmbed()
          .setTitle('🤖 Discord.js Handlers')
          .setColor('RANDOM')
          .setDescription('Guides and resources for Discord.js handlers:')
          .addField('Commando Framework Documentation', '[Official Link](https://discord.js.org/#/docs/commando)')
          .addField('Guide to Discord.js Bot Development', '[Official Link](https://discordjs.guide/)')
          .addField('Understanding Events in Discord.js', '[Official Link](https://discordjs.guide/popular-topics/events.html)')
          .addField('Creating a Music Bot with Discord.js', '[Official Link](https://gabys.ga/music-bot)')
          .addField('Creating a Moderation Bot with Discord.js', '[Official Link](https://repl.it/@toad22484/Command-Handler?v=1)')
          .addField('Setting Up a Command Handler in Discord.js v13', '[Official Link](https://dev.to/exoteq/setting-up-a-command-handler-in-discord-js-v13-3fma)')
          .addField('Advanced Discord.js Bot Tutorial', '[Official Link](https://replit.com/talk/learn/Advanced-Discordjs-Bot-Tutorial/49000)')
          .setFooter('Rights © These documents do not belong to Honie Studios');

        interaction.reply({ embeds: [handlersEmbed], ephemeral: true });
      } else if (selectedOption === 'js-code') {
        const jsCodeEmbed = new MessageEmbed()
          .setTitle('💻 JavaScript Code Snippets')
          .setColor('RANDOM')
          .setDescription('Useful JavaScript code snippets from the internet:')
          .addField('Awesome JavaScript - A Collection of Essential JS Snippets', '[Official Link](https://github.com/sorrycc/awesome-javascript#readme)')
          .addField('30 Seconds of Code - Short JavaScript Code Snippets for All Your Development Needs', '[Official Link](https://www.30secondsofcode.org/)')
          .addField('JSFiddle - Online JavaScript Editor', '[Official Link](https://jsfiddle.net/)')
          .addField('GitHub Gists - Create Instantly', '[Official Link](https://gist.github.com/)')
          .addField('JavaScript Algorithms and Data Structures', '[Official Link](https://github.com/trekhleb/javascript-algorithms#readme)')
          .setFooter('Rights © These documents do not belong to Honie Studios');

        interaction.reply({ embeds: [jsCodeEmbed], ephemeral: true });
      } else if (selectedOption === 'coming') {
        const comingEmbed = new MessageEmbed()
          .setTitle('🔧 Coming Soon')
          .setColor('RANDOM')
          .setDescription('We are working on more guides. If you have any suggestions, use `h/suggest`.');

        interaction.reply({ embeds: [comingEmbed], ephemeral: true });
      }
    });

    collector.on('end', (collected) => {
      if (collected.size === 0) {
        message.reply('**GUIDES** | Time ran out to select a category.');
      }
    });
  },
};
