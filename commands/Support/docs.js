const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');

module.exports = {
  name: 'docs',
  category: 'Support',
  aliases: [],
  description: 'Displays learning documents for everyone.',
  usage: 'docs',
  run: async (client, message, args) => {
    // Create a selection menu component
    const selectMenu = new MessageSelectMenu()
      .setCustomId('menu-resources')
      .setPlaceholder('🧷・ Click and select a category.');

    // Add options to the menu
    selectMenu.addOptions([
      {
        label: 'Ethical Hacking',
        value: 'hacking-ethical',
        description: 'Links related to ethical hacking.',
      },
      {
        label: 'Programming',
        value: 'programming',
        description: 'Links related to programming.',
      },
      {
        label: 'Neural Networks',
        value: 'neural-networks',
        description: 'Links related to Neural Networks.',
      },
      {
        label: 'Engineering',
        value: 'engineering',
        description: 'Links related to engineering.',
      },
      {
        label: 'Coming Soon',
        value: 'coming',
        description: 'More links coming soon.',
      },
    ]);

    // Create an action row with the selection menu
    const row = new MessageActionRow().addComponents(selectMenu);

    // Create an embed for the initial message
    const initialEmbed = new MessageEmbed()
      .setTitle('🧷・➥ Learning Links')
      .setColor('RANDOM')
      .setDescription('Select a category from the menu below to view the learning links we offer.');

    // Send the initial message with the menu
    await message.reply({ embeds: [initialEmbed], components: [row] });

    // Event handler to handle menu selection
    const filter = (interaction) =>
      interaction.isSelectMenu() && interaction.customId === 'menu-resources';

    const collector = message.channel.createMessageComponentCollector({
      filter,
      time: 60000, // Waiting time in milliseconds (60 seconds in this case)
    });

    collector.on('collect', async (interaction) => {
      const selectedOption = interaction.values[0];

      if (selectedOption === 'hacking-ethical') {
        // Ethical Hacking embed with real links
        const hackingEthicalEmbed = new MessageEmbed()
          .setTitle('🔒 Ethical Hacking')
          .setColor('RANDOM')
          .setDescription('Links related to ethical hacking:')
          .addField('Hacking from Scratch PDF (196 Pages)', '[Click Here](https://www.pdfdrive.com/hacking-from-scratch-e19046560.html)')
          .addField('Ethical Hacking by Carlos Tori - PDF Drive', '[Click Here](https://www.pdfdrive.com/ethical-hacking-e187570783.html)')
          .setFooter('Rights © These documents do not belong to Honie Studios');

        interaction.reply({ embeds: [hackingEthicalEmbed], ephemeral: true });
      } else if (selectedOption === 'programming') {
        // Programming embed with real links
        const programmingEmbed = new MessageEmbed()
          .setTitle('💻 Programming')
          .setColor('RANDOM')
          .setDescription('Links related to programming:')
          .addField('JS - Drive File', '[Click Here](https://drive.google.com/file/d/16UNqmaBu0GACT4YpIvcTHE9tRqqo7ll1/view?usp=drivesdk)')
          .addField('PYTHON - Drive File', '[Click Here](https://drive.google.com/file/d/1yq6u-4atoIqlSpQsttqRUBqqBHUaXISg/view?usp=drivesdk)')
          .setFooter('Rights © These documents do not belong to Honie Studios');

        interaction.reply({ embeds: [programmingEmbed], ephemeral: true });
      } else if (selectedOption === 'neural-networks') {
        // Neural Networks embed with real links
        const neuralNetworksEmbed = new MessageEmbed()
          .setTitle('🤖 Neural Networks in Python')
          .setColor('RANDOM')
          .setDescription('Links related to Neural Networks in Python:')
          .addField('Technology Blog', '[Click Here](https://blogs.imf-formacion.com/blog/tecnologia/crear-red-neuronal-en-phyton-202009/)')
          .setFooter('Rights © These documents do not belong to Honie Studios');

        interaction.reply({ embeds: [neuralNetworksEmbed], ephemeral: true });
      } else if (selectedOption === 'coming') {
        // Coming Soon embed
        const comingEmbed = new MessageEmbed()
          .setTitle('🔧 Coming Soon')
          .setColor('RANDOM')
          .setDescription('We are working on more links. If you have any suggestions, use `h/suggest`.');

        interaction.reply({ embeds: [comingEmbed], ephemeral: true });
      } else if (selectedOption === 'engineering') {
        // Engineering embed with real links
        const engineeringEmbed = new MessageEmbed()
          .setTitle('🔧 Engineering')
          .setColor('RANDOM')
          .setDescription('Links related to engineering:')
          .addField('Free Books', '[Click Here](https://infolibros.org/libros-pdf-gratis/ingenieria/)')
          .setFooter('Rights © These documents do not belong to Honie Studios');

        interaction.reply({ embeds: [engineeringEmbed], ephemeral: true });
      }
    });

    collector.on('end', (collected) => {
      if (collected.size === 0) {
        message.reply('<:Moderator_Logo:1183460215782391828> **DOCS** | Time ran out to select a category.');
      }
    });
  },
};
