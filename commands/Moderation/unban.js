const { MessageEmbed, Permissions, TextChannel } = require('discord.js');
const Unban = require('..//..//database/models/unbanModel'); // Reemplaza la ruta real a tu modelo Unban

module.exports = {
  name: 'unban',
  category: 'Moderation',
  aliases: [],
  description: 'Unban a user.',
  usage: 'h/unban [ID] [reason/optional]',
  examples: ["unban 828991790324514887 Test"],
  run: async (client, message, args) => {
    // Verificar los permisos del usuario
    if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
      const noPermissionEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('`sytem@user/perms/unban`\n<:Moderator_Logo:1183460215782391828> **UNBAN** | Permission Denied')
        .setDescription('You do not have permissions to use this command.');
      return message.reply({ embeds: [noPermissionEmbed] });
    }

    // Verificar si se proporciona un ID de usuario válido
    const userID = args[0];

    if (!userID || isNaN(userID)) {
      const invalidIDEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('`sytem@user/error/unban`\n<:Moderator_Logo:1183460215782391828> **UNBAN** | Missing Information')
        .setDescription('Valid use: `h/unban [@user|user_id] [reason]`.');
      return message.reply({ embeds: [invalidIDEmbed] });
    }

    // Verificar si se proporciona una razón para el desban
    const reason = args.slice(1).join(' ') || 'Force-UnBan';

    // Desbanear al usuario
    try {
      await message.guild.members.unban(userID, reason);

      // Registrar el desban en la base de datos MongoDB
      const unban = new Unban({
        user_id: userID,
        moderator_id: message.author.id,
        reason: reason,
        timestamp: new Date(),
      });

      unban.save()
        .then(() => {
          // Enviar un mensaje de registro al canal de moderación
          const LOGS_CHANNEL = '1162370084979867788'; // Importa LOGS_CHANNEL 

          const modLogChannel = client.channels.cache.get(LOGS_CHANNEL);

          if (modLogChannel instanceof TextChannel) {
            const modLogEmbed = new MessageEmbed()
              .setColor('#00ff00')
              .setTitle('`sytem@user/modlog/unban`\n<:utilitybanhammer:1183420381734907947> Honie Studios | Member UnBanned')
              .setDescription(`**Member UnBanned ID:** ${userID}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}`);
            modLogChannel.send({ embeds: [modLogEmbed] });
          } else {
            console.error('[CONSOLE ERROR] Canal de registro de moderación no encontrado.');
          }

          const successEmbed = new MessageEmbed()
            .setColor('#00ff00')
            .setDescription(`<:utility12:1183420388580012094> **UNBAN** | The user has been unbanned and registered in the moderation channel.`);
          message.channel.send({ embeds: [successEmbed] });
        })
        .catch(error => {
          console.error(`[CONSOLE ERRROR] Error al insertar el desban en la base de datos: ${error.message}`);
          const dbErrorEmbed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle('`sytem@user/error/unban`\n<:Moderator_Logo:1183460215782391828> **ERROR** | Error registering unban')
            .setDescription('An error occurred while registering the unban.');
          message.reply({ embeds: [dbErrorEmbed] });
        });
    } catch (error) {
      console.error('[CONSOLE ERROR]', error);
      const unbanErrorEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('`sytem@user/error/unban`\n<:Moderator_Logo:1183460215782391828> **Error** | Error unbanning user')
        .setDescription('An error occurred while trying to unban the user.');
      message.reply({ embeds: [unbanErrorEmbed] });
    }
  },
};
