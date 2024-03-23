const { MessageEmbed, Permissions, TextChannel } = require('discord.js');
const Unban = require('..//..//database/models/unbanModel');

module.exports = {
  name: 'unban',
  category: 'Moderation',
  aliases: [],
  description: 'Unban a user.',
  usage: 'h/unban [ID] [reason/optional]',
  examples: ["unban 828991790324514887 Test"],
  run: async (client, message, args) => {
    if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
      const noPermissionEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('**UNBAN** | Permission Denied')
        .setDescription('You do not have permissions to use this command.');
      return message.reply({ embeds: [noPermissionEmbed] });
    }

    const userID = args[0];

    if (!userID || isNaN(userID)) {
      const invalidIDEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('**UNBAN** | Missing Information')
        .setDescription('Valid use: `h/unban [@user|user_id] [reason]`.');
      return message.reply({ embeds: [invalidIDEmbed] });
    }

    const reason = args.slice(1).join(' ') || 'Force-UnBan';

    try {
      await message.guild.members.unban(userID, reason);
      const unban = new Unban({
        user_id: userID,
        moderator_id: message.author.id,
        reason: reason,
        timestamp: new Date(),
      });

      unban.save()
        .then(() => {
          const LOGS_CHANNEL = 'CHANNEL_LOG_ID';

          const modLogChannel = client.channels.cache.get(LOGS_CHANNEL);

          if (modLogChannel instanceof TextChannel) {
            const modLogEmbed = new MessageEmbed()
              .setColor('#00ff00')
              .setTitle('Honie Studios | Member UnBanned')
              .setDescription(`**Member UnBanned ID:** ${userID}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}`);
            modLogChannel.send({ embeds: [modLogEmbed] });
          } else {
            console.error('[CONSOLE ERROR] Canal de registro de moderación no encontrado.');
          }

          const successEmbed = new MessageEmbed()
            .setColor('#00ff00')
            .setDescription(`**UNBAN** | The user has been unbanned and registered in the moderation channel.`);
          message.channel.send({ embeds: [successEmbed] });
        })
        .catch(error => {
          console.error(`[CONSOLE ERRROR] Error al insertar el desban en la base de datos: ${error.message}`);
          const dbErrorEmbed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle('**ERROR** | Error registering unban')
            .setDescription('An error occurred while registering the unban.');
          message.reply({ embeds: [dbErrorEmbed] });
        });
    } catch (error) {
      console.error('[CONSOLE ERROR]', error);
      const unbanErrorEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('**Error** | Error unbanning user')
        .setDescription('An error occurred while trying to unban the user.');
      message.reply({ embeds: [unbanErrorEmbed] });
    }
  },
};
