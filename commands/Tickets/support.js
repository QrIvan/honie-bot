const { MessageEmbed, Permissions, MessageActionRow, MessageSelectMenu } = require('discord.js');

const categories = {
  'Purchases 🛒': '🛒',
  'Staff Support 👮': '👮',
  'Reclamation 📢': '📢',
};

const maxTicketsPerUser = 4;

module.exports = {
  name: 'support',

  category: 'Tickets',
  aliases: ["spp", "ticket", "staffsupport"],
  description: 'Open a support ticket.',
  usage: 'support',
  examples: ['support', 'ticket'],
  run: async (client, message, args) => {
    const userTickets = message.guild.channels.cache.filter(
      (channel) =>
        channel.type === 'GUILD_TEXT' &&
        channel.name.startsWith(`ticket-${message.author.id}`)
    );

    if (userTickets.size >= maxTicketsPerUser) {
      const ticketLimitEmbed = new MessageEmbed()
        .setColor('RED')
        .setTitle('Ticket Limit')
        .setDescription(`You already have **${maxTicketsPerUser} open tickets**! Please close one before opening another.`);

      return message.reply({ embeds: [ticketLimitEmbed] });
    }

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

    const categoryMenu = new MessageSelectMenu()
      .setCustomId('category-select')
      .setPlaceholder('🧷・ Click and select a category.')
      .addOptions(categoryOptions);

    const row = new MessageActionRow().addComponents(categoryMenu);

    const sentEmbed = await message.reply({ embeds: [embed], components: [row] });

    const filter = (interaction) => {
      return interaction.isSelectMenu() && interaction.customId === 'category-select' && interaction.user.id === message.author.id;
    };

    const collector = sentEmbed.createMessageComponentCollector({ filter, time: 60000 }); 

    collector.on('collect', async (interaction) => {
      const selectedCategory = interaction.values[0];

      const supportCategory = message.guild.channels.cache.find(category => category.type === 'GUILD_CATEGORY' && category.name === 'Support Tickets');

      if (!supportCategory) {
        const categoryErrorEmbed = new MessageEmbed()
          .setColor('RED')
          .setTitle('Category Error')
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
            id: "1183419688705867777",
            allow: [Permissions.FLAGS.VIEW_CHANNEL],
          },
          {
            id: "1183246663448531006",
            allow: [Permissions.FLAGS.VIEW_CHANNEL],
          },
          {
            id: "1183246662605471796",
            allow: [Permissions.FLAGS.VIEW_CHANNEL],
          },
        ],
      });

      await ticketChannel.setTopic(`Ticket of **${selectedCategory}** - User: ${message.author.tag} (ID: **${message.author.id}**)`);

      ticketChannel.send("<emoji> | <@&ROL_STAFF>");
      const welcomeEmbed = new MessageEmbed()
        .setTitle(`Ticket of ${selectedCategory} | <Emoji>`)
.setDescription('Welcome to your support ticket! A team member will assist you shortly.\n\n<EMoji> **↳** For a more efficient assistance, please let us know your issue related to this ticket.\n\n<Emoji> **↳** Remember to always follow our rules to avoid penalties <#CHANEL_ID>.\n\n<EMOJI> **↳** After your attention, remember to use our **h/feedback** command and a comment about how you thought of the support received.')        .setColor('#11955382');

      ticketChannel.send({ embeds: [welcomeEmbed] });

      interaction.update({ content: `<Emoji> **|** Your ticket has been created (${ticketChannel}).`, components: [] });
    });

    collector.on('end', (collected) => {
      if (collected.size === 0) {
        sentEmbed.edit({ content: '<Emoji> **TICKETS** | The time to select a category has expired.', components: [] });
      }
    });
  },
};
