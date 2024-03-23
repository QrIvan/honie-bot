const client = require('../../index.js');
const config = require('../../config.json');
const Discord = require('discord.js');

const canalID = 'ID_DEL_CANAL'; // Reemplaza 'ID_DEL_CANAL' con el ID del canal correcto

client.on('guildMemberAdd', async member => {
    const canal = member.guild.channels.cache.get(canalID);

    if (canal) {
        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('¡Welcome to Honie Studios! :wave:')
            .setDescription(`¡Welcome Developer ${member}!`)
            .addField('Rules, roles and information! ⤵️', 'Get information from us, free roles and some rules to follow\n* <#ID_DEL_CANAL>\n* <#ID_DEL_CANAL>\n* <#ID_DEL_CANAL>')
            .setTimestamp()
            .setFooter('Honie Studios | Welcome Sytem');

        canal.send({ embeds: [embed] });
    } else {
        console.log(`[CONSOLE ERROR] No se pudo encontrar el canal con ID: ${canalID}`);
    }

    const adminLogCanalID = 'ID_DEL_CANAL'; // Reemplaza 'ID_DEL_CANAL' con el ID del canal correcto
    const canalAdminLog = member.guild.channels.cache.get(adminLogCanalID);

    if (canalAdminLog) {
        const embedAdminLog = new Discord.MessageEmbed()
            .setColor('#ff0000')
            .setTitle('🔨 | New Member Joined Server')
            .addField('Member', `${member.user.tag} (${member})`, true)
            .addField('Join Date', member.joinedAt.toLocaleString(), true)
            .addField('Member Information', `**Username:** ${member.user.username}\n**Tag:** ${member.user.tag}\n**ID:** ${member.id}\n**Joined At:** ${member.joinedAt}\n**Account Created At:** ${member.user.createdAt}`)
            .setTimestamp();

        canalAdminLog.send({ embeds: [embedAdminLog] });
    } else {
        console.log(`[CONSOLE ERROR] No se pudo encontrar el canal de registro de administración con ID: ${adminLogCanalID}`);
    }
});
