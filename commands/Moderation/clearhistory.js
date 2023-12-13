const { MessageEmbed, Permissions } = require('discord.js');
const History = require('../../database/models/historyModel');

module.exports = {
  name: 'clearhistory',
  category: 'Moderation',
  aliases: [],
  description: 'Clear a user\'s sanction history.',
  usage: 'clearhistory [@user|user_id]',
  run: async (client, message, args) => {
    const user = message.mentions.users.first() || client.users.cache.get(args[0]);

    if (!user) {
      const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('`sytem@user/error/clearhistory`\n<:Moderator_Logo:1183460215782391828> **CLEAR HISTORY** | Missing Information')
        .setDescription('Valid use: `h/clearhistory [@user|user_id]`.');
      return message.reply({ embeds: [embed] });
    }

    if (message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) || message.member.roles.cache.has('1183246661309435944')) {
      try {
        // Eliminar registros de la base de datos
        await History.deleteMany({ user_id: user.id });

        const successEmbed = new MessageEmbed()
          .setColor('#00ff00')
          .setTitle(`📋 ⤷ • Cleared Sanction History for ${user.tag}`)
          .setDescription('The user\'s sanction history has been cleared successfully.');
        return message.reply({ embeds: [successEmbed] });
      } catch (error) {
        console.error('Error clearing sanction history:', error);
        const errorEmbed = new MessageEmbed()
          .setColor('#ff0000')
          .setTitle('`sytem@user/error/clearhistory`\n<:Moderator_Logo:1183460215782391828> **CLEAR HISTORY** | Error')
          .setDescription('An error occurred while clearing the sanction history.');
        message.reply({ embeds: [errorEmbed] });
      }
    } else {
      const noPermissionEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('`sytem@user/perms/clearhistory`\n<:Moderator_Logo:1183460215782391828> **CLEAR HISTORY** | Permission Denied')
        .setDescription('You do not have permission to use this command.');
      message.reply({ embeds: [noPermissionEmbed] });
    }
  },
};
