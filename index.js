const { Client, Collection, MessageEmbed } = require("discord.js");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require("fs");
const config = require("./config.json");
const db = require(".//database/index")
const express = require('express');
const port = 3000;
const app = express();
const users = new Map();

console.clear();
console.log(`----------------------------------------------------------`);
console.log(`\ * C.E.O ɪɴᴛᴇʀᴀᴄᴛɪᴏɴ ʀᴜɴ`);
console.log(`\ * C.E.O ʜᴏɴɪᴇ ꜱᴛᴜᴅɪᴏꜱ ᴛᴍ`);
console.log(`\ * Creator & Developer @ Honie Bot`);
console.log('Loading....');
console.log(`----------------------------------------------------------`);

const client = new Client({
    intents: 32767
});

app.get('/', (request, response) => {
    return response.sendFile('./web/index.html', { root: '.' });
});
app.listen(port, () => console.log("[WEBSITE] Express is ready."));

client.commands = new Collection();
client.slash_commands = new Collection();
client.aliases = new Collection();
client.events = new Collection();
client.categories = fs.readdirSync("./commands");

module.exports = client;

["prefix", "slash", "event"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

process.on('unhandledRejection', err => {
    console.log(`[ERROR] Unhandled promise rejection: ${err.message}.`);
    console.log(err);
});

const AUTH = process.env.TOKEN || config.client.TOKEN;
if (!AUTH) {
    console.warn("[WARN] ¡Debes proporcionar un token de Bot!").then(async () => process.exit(1));
} else {
    client.login(AUTH).catch(() => console.log("[WARN] Parece que el token no es válido; vuelva a verificarlo. Si este error sigue apareciendo, habilite los 3 intentos de puerta de enlace."));
}
