const { MessageEmbed, Permissions } = require('discord.js');
const History = require('../../database/models/historyModel');

module.exports = {
  name: 'history',
  category: 'Moderation',
  aliases: [],
  description: 'View a user\'s sanction history.',
  usage: 'history [@user|user_id]',
  run: async (client, message, args) => {
    const user = message.mentions.users.first() || client.users.cache.get(args[0]);

    if (!user) {
      const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('**HISTORY** | Missing Information')
        .setDescription('Valid use: `h/history [@user|user_id]`.');
      return message.reply({ embeds: [embed] });
    }

    if (message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) || message.member.roles.cache.has('ROL_STAFF')) {
      try {
        const history = await History.find({ user_id: user.id }).sort({ timestamp: -1 });

        if (history.length === 0) {
          const embed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle(`📋 ⤷ • Sanction History for ${user.tag}`)
            .setDescription('This user has no recorded sanctions.');
          return message.reply({ embeds: [embed] });
        }

        const pageSize = 5;
        const totalPages = Math.ceil(history.length / pageSize);

        let page = 1;
        let startIndex = (page - 1) * pageSize;
        let endIndex = startIndex + pageSize;

        const generateEmbed = (page) => {
          const embed = new MessageEmbed()
            .setColor('#ff0000')
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setTitle(`📋 ⤷ • Sanction History for ${user.tag}`)
            .setFooter(`Page ${page}/${totalPages}`);

          const pageHistory = history.slice(startIndex, endIndex);

          pageHistory.forEach((record) => {
            const { type, moderator_tag, reason, timestamp } = record;
            embed.addField(
              `**Moderator**: ${moderator_tag}`,
              `**Type**: ${type}\n**Reason**: ${reason}\n**Date**: ${timestamp}`
            );
          });

          return embed;
        };

        const msg = await message.reply({ embeds: [generateEmbed(page)] });
        await msg.react('⬅️');
        await msg.react('➡️');

        const filter = (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && !user.bot;
        const collector = msg.createReactionCollector({ filter, time: 60000 });

        collector.on('collect', (reaction, user) => {
          reaction.users.remove(user);

          if (reaction.emoji.name === '⬅️') {
            if (page > 1) {
              page--;
              startIndex = (page - 1) * pageSize;
              endIndex = startIndex + pageSize;
              msg.edit({ embeds: [generateEmbed(page)] });
            }
          } else if (reaction.emoji.name === '➡️') {
            if (page < totalPages) {
              page++;
              startIndex = (page - 1) * pageSize;
              endIndex = startIndex + pageSize;
              msg.edit({ embeds: [generateEmbed(page)] });
            }
          }
        });
      } catch (error) {
        console.error('[CONSOLE ERROR] Error fetching sanction history:', error);
        const errorEmbed = new MessageEmbed()
          .setColor('#ff0000')
          .setTitle('**HISTORY** | Error')
          .setDescription('An error occurred while fetching the sanction history.');
        message.reply({ embeds: [errorEmbed] });
      }
    } else {
      const noPermissionEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('**HISTORY** | Permission Denied')
        .setDescription('You do not have permission to use this command.');
      message.reply({ embeds: [noPermissionEmbed] });
    }
  },
};
