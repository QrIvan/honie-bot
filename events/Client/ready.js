const client = require("../../index.js");
const config = require("../../config.json");
const { MessageEmbed } = require('discord.js');
const ms = require("ms");

let savedActivity;
let savedStatus;

client.once('ready', async () => {
  console.log(`[CLIENT] ${client.user.tag} is up and ready to go! Watching ${client.guilds.cache.size} servers and ${client.users.cache.size} users.`);

  const up = ms(ms(Math.round(process.uptime() - (client.uptime / 1000)) + ' seconds'));
  const status = 'h/help for help'
  const status2 = `${client.users.cache.size} users 👥`
  const status3 = 'h/ticket for staff help'


  console.log(`[NODEJS] Your IDE took ${up} to load and connect to the bot.`);

  savedActivity = client.user.presence.activities[0];
  savedStatus = client.user.presence.status;

  client.user.setStatus('idle');

  var activities = [`${status}`, `${status2}`, `${status3}`], i = 0;
  setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]}`, { type: "PLAYING" }), 120000);
  const channelId = 'READY_CHANNEL:ID'; // Reemplaza con el ID del canal al que deseas enviar el mensaje

  const channel = client.channels.cache.get(channelId);

  channel.send("<@&ROL FOR PING> | <Emoji>");

  if (channel) {
    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('<Emoji> | Bot On')
      .setDescription(`Been online and ready to go.\nHard **${up}** to load all the data.`)
      .setTimestamp();

    channel.send({ embeds: [embed] });
  } else {
    console.error(`[CONSOLE ERROR] Could not find channel with ID ${channelId}.`);
  }
});
client.on('resume', (replayed) => {
  console.log(`[CLIENT] ${client.user.tag} has reconnected. Replayed ${replayed} events.`);
  client.user.setPresence({
    activities: [savedActivity],
    status: savedStatus, 
  });
});
