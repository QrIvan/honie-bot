const { MessageEmbed, Permissions, MessageActionRow, MessageSelectMenu } = require('discord.js');

// Define help categories and their corresponding emojis
const categories = {
  'Purchases 🛒': '🛒',
  'Staff Support 👮': '👮',
  'Reclamation 📢': '📢',
};

// Define the maximum number of tickets per user
const maxTicketsPerUser = 4;

module.exports = {
  name: 'support',

  category: 'Tickets',
  aliases: ["spp", "ticket", "staffsupport"],
  description: 'Open a support ticket.',
  usage: 'support',
  examples: ['support', 'ticket'],
  run: async (client, message, args) => {
    // Check if the user already has the maximum number of open tickets
    const userTickets = message.guild.channels.cache.filter(
      (channel) =>
        channel.type === 'GUILD_TEXT' &&
        channel.name.startsWith(`ticket-${message.author.id}`)
    );

    if (userTickets.size >= maxTicketsPerUser) {
      const ticketLimitEmbed = new MessageEmbed()
        .setColor('RED')
        .setTitle('`sytem@user/error/tickets`\n<:Moderator_Logo:1183460215782391828> | Ticket Limit')
        .setDescription(`You already have **${maxTicketsPerUser} open tickets**! Please close one before opening another.`);

      return message.reply({ embeds: [ticketLimitEmbed] });
    }

    // Create an embed with categories as menu selection options
    const embed = new MessageEmbed()
      .setTitle('🎫・➥ To open a ticket, select a category:')
      .setColor('#3498db');

    const categoryOptions = [];
    for (const category in categories) {
      categoryOptions.push({
        label: category,
        value: category,
        description: `Select this category to open a ${category} ticket.`,
      });
    }

    // Create a select menu component
    const categoryMenu = new MessageSelectMenu()
      .setCustomId('category-select')
      .setPlaceholder('🧷・ Click and select a category.')
      .addOptions(categoryOptions);

    // Create an action row with the category selection menu
    const row = new MessageActionRow().addComponents(categoryMenu);

    const sentEmbed = await message.reply({ embeds: [embed], components: [row] });

    // Filter interaction by select menu component
    const filter = (interaction) => {
      return interaction.isSelectMenu() && interaction.customId === 'category-select' && interaction.user.id === message.author.id;
    };

    const collector = sentEmbed.createMessageComponentCollector({ filter, time: 60000 }); // Timeout: 60 seconds

    collector.on('collect', async (interaction) => {
      const selectedCategory = interaction.values[0];

      // Create a channel for the ticket in the corresponding category
      const supportCategory = message.guild.channels.cache.find(category => category.type === 'GUILD_CATEGORY' && category.name === 'Support Studios');

      if (!supportCategory) {
        const categoryErrorEmbed = new MessageEmbed()
          .setColor('RED')
          .setTitle('`sytem@user/error/tickets`\n<:Moderator_Logo:1183460215782391828> | Category Error')
          .setDescription('🤖 "Support Tickets" category not found. Please contact an administrator.');

        return message.reply({ embeds: [categoryErrorEmbed] });
      }

      const ticketChannel = await message.guild.channels.create(`ticket-${message.author.id}`, {
        type: 'GUILD_TEXT',
        parent: supportCategory.id,
        permissionOverwrites: [
          {
            id: message.guild.id, // @everyone
            deny: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES],
          },
          {
            id: message.author.id,
            allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.READ_MESSAGE_HISTORY, Permissions.FLAGS.SEND_MESSAGES],
          },
          {
            id: "1183419688705867777", // ID de un rol permitido
            allow: [Permissions.FLAGS.VIEW_CHANNEL],
          },
          {
            id: "1183246663448531006", // ID de otro rol permitido
            allow: [Permissions.FLAGS.VIEW_CHANNEL],
          },
          {
            id: "1183246662605471796", // ID de otro rol permitido
            allow: [Permissions.FLAGS.VIEW_CHANNEL],
          },
        ],
      });

      // Add a description to the ticket channel with user tag and ID
      await ticketChannel.setTopic(`Ticket of **${selectedCategory}** - User: ${message.author.tag} (ID: **${message.author.id}**)`);

      // Send a welcome message in the ticket channel
      ticketChannel.send("<a:uh_stafflogo:1183420465902006273> | <@&1183419688705867777>");

      const welcomeEmbed = new MessageEmbed()
        .setTitle(`Ticket of ${selectedCategory} | <a:Honie_CatHello:1180624859689132042>`)
        .setDescription('`sytem@user/ticket/welcome`\nWelcome to your support ticket! A team member will assist you shortly.\n\n<:pepethink:1183420406321917952> **↳** For a more efficient assistance, please let us know your issue related to this ticket.\n\n<:Moderator_Logo:1183460215782391828> **↳** Remember to always follow our rules to avoid penalties <#1183246702422016071>.\n\n<a:ZLogoTTM:1183420434843181126> **↳** After your attention, remember to use our **h/feedback** command and a comment about how you thought of the support received.')
        .setColor('#11955382');

      ticketChannel.send({ embeds: [welcomeEmbed] });

      interaction.update({ content: `<:Honie_Check:1180626860682530937> **|** Your ticket has been created (${ticketChannel}).`, components: [] });
    });

    collector.on('end', (collected) => {
      if (collected.size === 0) {
        sentEmbed.edit({ content: '<:Moderator_Logo:1183460215782391828> **TICKETS** | The time to select a category has expired.', components: [] });
      }
    });
  },
};
