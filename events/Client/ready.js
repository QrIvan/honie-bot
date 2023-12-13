const client = require("../../index.js");
const config = require("../../config.json");
const { MessageEmbed } = require('discord.js');
const ms = require("ms");

// Variables para guardar el estado actual
let savedActivity;
let savedStatus;

client.once('ready', async () => {
  console.log(`[CLIENT] ${client.user.tag} is up and ready to go! Watching ${client.guilds.cache.size} servers and ${client.users.cache.size} users.`);

  const up = ms(ms(Math.round(process.uptime() - (client.uptime / 1000)) + ' seconds'));
  const status = 'h/help for help'
  const status2 = `${client.users.cache.size} users 👥`
  const status3 = 'h/ticket for staff help'


  console.log(`[NODEJS] Your IDE took ${up} to load and connect to the bot.`);

  // Guarda el estado actual
  savedActivity = client.user.presence.activities[0];
  savedStatus = client.user.presence.status;

  //, `${client.guilds.cache.size} servers`, `${client.users.cache.size} users!

  client.user.setStatus('idle');

  var activities = [`${status}`, `${status2}`, `${status3}`], i = 0;
  //${config.prefix}help | 
  setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]}`, { type: "PLAYING" }), 120000);
  const channelId = '1183246703978090566'; // Reemplaza con el ID del canal al que deseas enviar el mensaje

  const channel = client.channels.cache.get(channelId);

  channel.send("<@&1183441457273638974> | <a:ZLogo3TTM:1183420441897996298>");

  if (channel) {
    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('<a:ZLogo3TTM:1183420441897996298> | Bot On')
      .setDescription(`Been online and ready to go.\nHard **${up}** to load all the data.`)
      .setTimestamp();

    channel.send({ embeds: [embed] });
  } else {
    console.error(`[CONSOLE ERROR] Could not find channel with ID ${channelId}.`);
  }
});

// Evento que se dispara cuando el bot se reconecta
client.on('resume', (replayed) => {
  console.log(`[CLIENT] ${client.user.tag} has reconnected. Replayed ${replayed} events.`);
  // Puedes realizar acciones adicionales en caso de reconexión si lo necesitas.

  // Restablece el estado después de la reconexión
  client.user.setPresence({
    activities: [savedActivity], // Restablece la actividad guardada
    status: savedStatus, // Restablece el estado guardado
  });
});
