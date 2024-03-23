const { MessageEmbed, Permissions } = require('discord.js');
const mongoose = require('mongoose');
const Warn = require('..//..//database/models/warnModel');

module.exports = {
  name: 'warn',
  category: 'Moderation',
  aliases: [],
  description: 'Warn a member of the server.',
  usage: 'warn @user [reason]',
  examples: ["warn @QrIvan Reason for the warning"],
  run: async (client, message, args) => {
    const hasModeratorPermission = message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES);
    const hasSpecificRole = message.member.roles.cache.has('ROL_STAFF'); // Reemplaza con el ID de tu rol

    if (!hasModeratorPermission && !hasSpecificRole) {
      const noPermissionEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('**WARN** | Permission Denied')
        .setDescription('You do not have permissions to use this command.');
      return message.reply({ embeds: [noPermissionEmbed] });
    }

    const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (!target) {
      const noUserMentionedEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('**WARN** | Missing User Mention or ID')
        .setDescription('Valid use: `h/warn [@user|user_id] [reason]`.');
      return message.reply({ embeds: [noUserMentionedEmbed] });
    }

    const reason = args.slice(1).join(' ');

    if (!reason) {
      const noReasonProvidedEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('**WARN** | No Reason Provided')
        .setDescription('Valid use: `h/warn [@user|user_id] [reason]`.');
      return message.reply({ embeds: [noReasonProvidedEmbed] });
    }

    try {
      const warn = new Warn({
        user_id: target.id,
        moderator_id: message.author.id,
        reason: reason,
      });

      await warn.save();

      const warnSuccessEmbed = new MessageEmbed()
        .setColor('#ffcc00')
        .setTitle('**WARN** | User Warned')
        .setDescription(`The user has been correctly warned.\n**User Warned:** ${target.user.tag}\n**Reason:** ${reason}`);
      message.reply({ embeds: [warnSuccessEmbed] });

      const canalDeRegistrosId = 'CHANNEL_LOG_ID'; // Reemplaza con el ID del canal de registros
      const canalDeRegistros = message.guild.channels.cache.get(canalDeRegistrosId);

      if (canalDeRegistros) {
        const registroEmbed = new MessageEmbed()
          .setColor('#ffcc00')
          .setTitle('Honie Studios | User Warned')
          .setDescription(`**User Warned:** ${target.user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}`);
        canalDeRegistros.send({ embeds: [registroEmbed] });
      }
    } catch (error) {
      console.error(error);
      const warnErrorEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('**WARN** | Error Warning User')
        .setDescription('An error occurred while warning the user.');
      return message.reply({ embeds: [warnErrorEmbed] });
    }
  },
};
