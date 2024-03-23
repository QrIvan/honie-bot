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
    const error = args.join(' ');

    if (!error) {
      const missingErrorEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('**BUG REPORT** | Missing Error')
        .setDescription('Valid use: `h/report [bug/error]`.');
      return message.reply({ embeds: [missingErrorEmbed] });
    }

    const logsChannelID = 'logsChannelID';
    const logsChannel = message.guild.channels.cache.get(logsChannelID);

    if (!logsChannel) {
      const logsChannelMissingEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('**BUG REPORT** | Logs Channel Misconfigured')
        .setDescription('The logs channel is not configured correctly.');
      return message.reply({ embeds: [logsChannelMissingEmbed] });
    }

    const embed = new MessageEmbed()
      .setColor('#FF0000')
      .setTitle('`sytem@user/new/report`\n<a:ZLogoTTM:1183420434843181126> New Error Report')
      .addField('📢 ➥ Member ID', `${message.author} (${message.author.id})`)
      .addField('📋 ➥ Reported Error', error);

    const sentMessage = await logsChannel.send({ embeds: [embed] });
    await sentMessage.react('⚙️');
    await sentMessage.react('👍');

    const userData = require('..//..//userErrorData.json');
    const userID = message.author.id;

    if (!userData[userID]) {
      userData[userID] = {
        errorCount: 0,
      };
    }

    userData[userID].errorCount++;
    const bugHunterRoles = {
      '5': 'bugHunterRoles', // Bug Hunter: 5 error
    };

    const userRoleID = message.member.roles.cache.map(role => role.id).find(roleID => bugHunterRoles[roleID]);

    for (const [errorLimit, roleID] of Object.entries(bugHunterRoles)) {
      if (userData[userID].errorCount >= parseInt(errorLimit) && !userRoleID) {
        const bugHunterRole = message.guild.roles.cache.get(roleID);

        if (bugHunterRole) {
          message.member.roles.add(bugHunterRole);
          userData[userID].errorCount = 0;
        }
      }
    }

    fs.writeFileSync('..//..//userErrorData.json', JSON.stringify(userData, null, 2));
    const confirmationEmbed = new MessageEmbed()
      .setColor('ORANGE')
      .setDescription('**BUG REPORT** | Your error has been notified to the developers. Thank you for your help.');

    const confirmationMessage = await message.reply({ embeds: [confirmationEmbed] });
    const filter = (reaction, user) => ['⚙️', '👍'].includes(reaction.emoji.name) && !user.bot;
    const collector = confirmationMessage.createReactionCollector({ filter, max: 1, time: 90000 });

    collector.on('collect', async (reaction) => {
      if (reaction.emoji.name === '⚙️') {
        confirmationMessage.edit('**BUG REPORT** | Your report is being reviewed and will be improved soon. Thank you for your patience!');
      } else if (reaction.emoji.name === '👍') {
        confirmationMessage.edit('**BUG REPORT** | Your report is being reviewed. Thank you for your patience!');
      }
    });

    collector.on('end', () => {
      confirmationMessage.reactions.removeAll().catch(console.error);
    });
  },
};
