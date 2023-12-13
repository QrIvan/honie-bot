const fs = require('fs');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'report',
  aliases: ['bugreport', 'bug'],
  category: 'Support',
  description: 'Report a bot error to the developer.',
  usage: 'report <error>',
  examples: ['report I cannot use the help command.'],
  run: async (client, message, args, prefix) => {
    // Check if an error was provided
    const error = args.join(' ');

    if (!error) {
      const missingErrorEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('`sytem@user/error/report`\n<:Moderator_Logo:1183460215782391828> **BUG REPORT** | Missing Error')
        .setDescription('Valid use: `h/report [bug/error]`.');
      return message.reply({ embeds: [missingErrorEmbed] });
    }

    // Replace 'ID_OF_LOGS_CHANNEL' with the ID of the logs channel where you want to send the error report
    const logsChannelID = '1183470680105291826';

    // Get the logs channel
    const logsChannel = message.guild.channels.cache.get(logsChannelID);

    if (!logsChannel) {
      const logsChannelMissingEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('`sytem@user/error/report`\n<a:ZLogoTTM:1183420434843181126> **BUG REPORT** | Logs Channel Misconfigured')
        .setDescription('The logs channel is not configured correctly.');
      return message.reply({ embeds: [logsChannelMissingEmbed] });
    }

    // Create an embed message for the error report
    const embed = new MessageEmbed()
      .setColor('#FF0000') // Red color to indicate an error
      .setTitle('`sytem@user/new/report`\n<a:ZLogoTTM:1183420434843181126> New Error Report')
      .addField('📢 ➥ Member ID', `${message.author} (${message.author.id})`)
      .addField('📋 ➥ Reported Error', error);

    // Send the error report to the logs channel
    const sentMessage = await logsChannel.send({ embeds: [embed] });

    // Add reactions to the message sent in the logs channel
    await sentMessage.react('⚙️'); // Wrench emoji reaction
    await sentMessage.react('<:utility12:1183420388580012094>'); // Checkmark emoji reaction

    // Incrementar el contador de errores para el usuario
    const userData = require('..//..//userErrorData.json');
    const userID = message.author.id;

    // Asegurarse de que el usuario tenga una entrada en el archivo de datos
    if (!userData[userID]) {
      userData[userID] = {
        errorCount: 0,
      };
    }

    // Incrementar el contador de errores
    userData[userID].errorCount++;

    // Definir los roles de Bug Hunter con sus respectivos límites de errores
    const bugHunterRoles = {
      '5': '1153053630644092990', // Bug Hunter: 1 error
    };

    // Obtener el rol actual del usuario
    const userRoleID = message.member.roles.cache.map(role => role.id).find(roleID => bugHunterRoles[roleID]);

    // Verificar si el usuario ha alcanzado un nuevo rango de Bug Hunter
    for (const [errorLimit, roleID] of Object.entries(bugHunterRoles)) {
      if (userData[userID].errorCount >= parseInt(errorLimit) && !userRoleID) {
        const bugHunterRole = message.guild.roles.cache.get(roleID);

        if (bugHunterRole) {
          // Otorgar el nuevo rol de Bug Hunter
          message.member.roles.add(bugHunterRole);

          // Reiniciar el contador de errores para el nuevo rango
          userData[userID].errorCount = 0;
        }
      }
    }

    // Guardar los cambios en el archivo de datos
    fs.writeFileSync('..//..//userErrorData.json', JSON.stringify(userData, null, 2));

    // Send a confirmation and thank you message in the same channel
    const confirmationEmbed = new MessageEmbed()
      .setColor('ORANGE') // Green color for confirmation
      .setDescription('<:utility12:1183420388580012094> **BUG REPORT** | Your error has been notified to the developers. Thank you for your help.');

    const confirmationMessage = await message.reply({ embeds: [confirmationEmbed] });

    // Create a filter for reactions on the confirmation message
    const filter = (reaction, user) => ['⚙️', '<:utility12:1183420388580012094>'].includes(reaction.emoji.name) && !user.bot;

    // Wait for reactions on the confirmation message
    const collector = confirmationMessage.createReactionCollector({ filter, max: 1, time: 90000 });

    collector.on('collect', async (reaction) => {
      if (reaction.emoji.name === '⚙️') {
        // If reacted with ⚙️, edit the thank you message in the same channel
        confirmationMessage.edit('<:Honie_DeveloperV:1180624841519411323> **BUG REPORT** | Your report is being reviewed and will be improved soon. Thank you for your patience!');
      } else if (reaction.emoji.name === '<:utility12:1183420388580012094>') {
        // If reacted with <:utility12:1183420388580012094>, edit the thank you message in the same channel
        confirmationMessage.edit('<:utility12:1183420388580012094> **BUG REPORT** | Your report is being reviewed. Thank you for your patience!');
        // If reacted with <:utility12:1183420388580012094>, perform another action (if necessary)
        // You can add code here for the action you want to perform
      }
    });

    collector.on('end', () => {
      // Remove reactions after the collection is complete
      confirmationMessage.reactions.removeAll().catch(console.error);
    });
  },
};
