const client = require('../../index.js');
const config = require('../../config.json');
const Discord = require('discord.js');

// ID del canal donde quieres enviar el mensaje en formato de embed
const canalID = '1183246701293740262'; // Reemplaza 'ID_DEL_CANAL' con el ID del canal correcto

client.on('messageCreate', async message => {
    // Tu código actual para manejar comandos
});

client.on('guildMemberAdd', async member => {
    const canal = member.guild.channels.cache.get(canalID);

    if (canal) {
        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('¡Welcome to Honie Studios! <a:HELLOGOODBYE:1183420457869905920>')
            .setDescription(`¡Welcome Developer ${member}! <:2020_devlogo:1183420447291879574>`)
            .addField('Rules, roles and information! ⤵️', 'Get information from us, free roles and some rules to follow\n* <#1183246691932049418>\n* <#1183246702422016071>\n* <#1183246706725359638>')
            .setTimestamp()
            .setFooter('Honie Studios | Welcome Sytem');

        canal.send({ embeds: [embed] });
    } else {
        console.log(`[CONSOLE ERROR] No se pudo encontrar el canal con ID: ${canalID}`);
    }

    const adminLogCanalID = '1183447592395350128';
    const canalAdminLog = member.guild.channels.cache.get(adminLogCanalID);

    if (canalAdminLog) {
        const embedAdminLog = new Discord.MessageEmbed()
            .setColor('#ff0000')
            .setTitle('<a:uh_stafflogo:1183420465902006273> | New Member Joined Server')
            .addField('Member', `${member.user.tag} (${member})`, true)
            .addField('Join Date', member.joinedAt.toLocaleString(), true)
            .addField('Member Information', `**Username:** ${member.user.username}\n**Tag:** ${member.user.tag}\n**ID:** ${member.id}\n**Joined At:** ${member.joinedAt}\n**Account Created At:** ${member.user.createdAt}`)
            .setTimestamp();

        canalAdminLog.send({ embeds: [embedAdminLog] });
    } else {
        console.log(`[CONSOLE ERROR] No se pudo encontrar el canal de registro de administración con ID: ${adminLogCanalID}`);
    }
});
