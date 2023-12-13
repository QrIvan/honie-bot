const { MessageEmbed, Permissions } = require('discord.js');
const mongoose = require('mongoose');
const Warn = require('..//..//database/models/warnModel'); // Import the Warn model from Mongoose

module.exports = {
  name: 'warn',
  category: 'Moderation',
  aliases: [],
  description: 'Warn a member of the server.',
  usage: 'warn @user [reason]',
  examples: ["warn @QrIvan Reason for the warning"],
  run: async (client, message, args) => {
    // Check permissions of the user executing the command
    const hasModeratorPermission = message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES);
    const hasSpecificRole = message.member.roles.cache.has('1183419688705867777'); // Reemplaza con el ID de tu rol

    if (!hasModeratorPermission && !hasSpecificRole) {
      const noPermissionEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('`sytem@user/perms/warn`\n<:Moderator_Logo:1183460215782391828> **WARN** | Permission Denied')
        .setDescription('You do not have permissions to use this command.');
      return message.reply({ embeds: [noPermissionEmbed] });
    }

    // Check if a user is mentioned
    const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (!target) {
      const noUserMentionedEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('`sytem@user/error/warn`\n<:Moderator_Logo:1183460215782391828> **WARN** | Missing User Mention or ID')
        .setDescription('Valid use: `h/warn [@user|user_id] [reason]`.');
      return message.reply({ embeds: [noUserMentionedEmbed] });
    }

    // Check if a reason is provided for the warning
    const reason = args.slice(1).join(' ');

    if (!reason) {
      const noReasonProvidedEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('`sytem@user/error/warn`\n<:Moderator_Logo:1183460215782391828> **WARN** | No Reason Provided')
        .setDescription('Valid use: `h/warn [@user|user_id] [reason]`.');
      return message.reply({ embeds: [noReasonProvidedEmbed] });
    }

    try {
      // Register the warning in the database (using the Warn model from Mongoose)
      const warn = new Warn({
        user_id: target.id,
        moderator_id: message.author.id,
        reason: reason,
      });

      await warn.save();

      const warnSuccessEmbed = new MessageEmbed()
        .setColor('#ffcc00')
        .setTitle('`sytem@user/new/warn`\n<:Moderator_Logo:1183460215782391828> **WARN** | User Warned')
        .setDescription(`The user has been correctly warned.\n**User Warned:** ${target.user.tag}\n**Reason:** ${reason}`);
      message.reply({ embeds: [warnSuccessEmbed] });

      // ID del canal de registros
      const canalDeRegistrosId = '1183447592395350128'; // Reemplaza con el ID del canal de registros
      const canalDeRegistros = message.guild.channels.cache.get(canalDeRegistrosId);

      if (canalDeRegistros) {
        // Envía el registro de advertencia al canal de registros
        const registroEmbed = new MessageEmbed()
          .setColor('#ffcc00')
          .setTitle('`sytem@user/modlog/warn`\n<a:uh_stafflogo:1183420465902006273> Honie Studios | User Warned')
          .setDescription(`**User Warned:** ${target.user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}`);
        canalDeRegistros.send({ embeds: [registroEmbed] });
      }
    } catch (error) {
      console.error(error);
      const warnErrorEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('`sytem@user/error/warn`\n<:Moderator_Logo:1183460215782391828> **WARN** | Error Warning User')
        .setDescription('An error occurred while warning the user.');
      return message.reply({ embeds: [warnErrorEmbed] });
    }
  },
};
