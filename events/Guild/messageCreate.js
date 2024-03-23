const client = require('../../index.js');
const config = require('../../config.json');
const Discord = require('discord.js');
const { Client, Intents, MessageEmbed, WebhookClient } = require('discord.js');

const verificationCommand = 'verify'; // Comando de verificación
const roleToAddID = 'Verificado'; // ID del rol "Verificado"
const roleToRemoveID = 'No Verificado'; // ID del rol "No Verificado"
const allowedVerificationChannelID = 'ID_DEL_CANAL_VERIFICACION'; // Reemplaza 'ID_DEL_CANAL_VERIFICACION' con el ID del canal de verificación

client.on('guildMemberAdd', (member) => {
    // Cuando un miembro entra, asigna el rol "No Verificado" y quita el rol "Verificado"
    const roleToAdd = member.guild.roles.cache.get(roleToRemoveID);
    const roleToRemove = member.guild.roles.cache.get(roleToAddID);

    if (roleToAdd && roleToRemove) {
        member.roles.add(roleToAdd);
        member.roles.remove(roleToRemove);

        const welcomeChannel = member.guild.channels.cache.get(allowedVerificationChannelID);

        welcomeChannel.send(`${member}`).then(memberMention => {
            const welcomeEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Welcome to the server! :wave:`)
                .setDescription(`To **verify** your account, use the \`${config.prefix}${verificationCommand}\` command in this channel.`)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setFooter('Honie Studios | Verify Sytem');
        
            welcomeChannel.send({ embeds: [welcomeEmbed] }).then(msg => {
                setTimeout(() => {
                    msg.delete();
                    memberMention.delete(); // Elimina la mención del miembro
                }, 60000); // Elimina el mensaje después de 1 minuto
            });
        });
    }
});


client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    const botMention = message.mentions.users.has(client.user.id);

    if (botMention) {
        const embed = new MessageEmbed()
            .setColor('#3498db')
            .setTitle(':wave: Hello! How can I help you?')
            .setDescription('If you need assistance with commands or support, you can use the following:')
            .addField('Command Help', 'Use `h/help` to get information about available commands.')
            .addField('Support Ticket', 'If you need further assistance, create a support ticket with `h/ticket`.')
            .setFooter('Honie Studios | Bot Assistance')
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
});



client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(config.prefix)) return;
    if (!message.guild) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if (cmd.length == 0) return;

    if (cmd === verificationCommand) {
        if (message.channel.id !== allowedVerificationChannelID) {
            return message.reply(':x: | You cannot use this command on this channel.');
        }

        if (!message.member.roles.cache.has(roleToAddID)) {
            const roleToAdd = message.guild.roles.cache.get(roleToAddID);
            const roleToRemove = message.guild.roles.cache.get(roleToRemoveID);

            message.member.roles.add(roleToAdd).then(() => {
                message.member.roles.remove(roleToRemove);

                const embed = new Discord.MessageEmbed()
                    .setColor('#00ff00')
                    .setTitle('You have successfully verified yourself 👍')
                    .setDescription('Enjoy the server and all its channels to the fullest! :hugging:')
                    .setFooter('This message will be deleted in 1 minute.');

                message.reply({ embeds: [embed] }).then((reply) => {
                    setTimeout(() => {
                        message.delete();
                        reply.delete();
                    }, 60000);
                });
            }).catch((error) => {
                console.error('[CONSOLE ERROR] Error al verificar usuario:', error);
                message.reply(':x: | Could not verify, contact an administrator.');
            });
        } else {
            const embed = new Discord.MessageEmbed()
                .setColor('#ff0000')
                .setTitle(':x: | You are already verified ')
                .setDescription('If it is already verified, we recommend not using this command anymore.')
                .setFooter('This message will be deleted in 1 minute.');

            message.reply({ embeds: [embed] }).then((reply) => {
                setTimeout(() => {
                    message.delete();
                    reply.delete();
                }, 60000);
            });
        }
    } else {
        let command = client.commands.get(cmd);
        if (!command) command = client.commands.get(client.aliases.get(cmd));
        if (command) {
            try {
                let prefix = config.prefix;
                if (!prefix) prefix = "h/";

                command.run(client, message, args, prefix);
            } catch (e) {
                function id(length) {
                    var result = '';
                    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    var charactersLength = characters.length;
                    for (var i = 0; i < length; i++) {
                        result += characters.charAt(Math.floor(Math.random() * charactersLength));
                    }
                    return result;
                }

                const errorID = id(12);

                console.error(`[ERROR] Error ID: ${errorID}\n ` + e);

                const embed = new Discord.MessageEmbed()
                    .setColor('#ff0000')
                    .setDescription(`Ocurrió un error. ID de error: \`${errorID}\``)
                    .setFooter('This message will be deleted in 1 minute.');

                message.reply({ embeds: [embed] }).then((reply) => {
                    setTimeout(() => {
                        message.delete();
                        reply.delete();
                    }, 60000);
                });
            }
        }
    }
});

const logChannelId = 'ID_DEL_CANAL_LOGS'; // Reemplaza con el ID de tu canal de registro

//MESSAGE LOG
client.on('messageUpdate', (oldMessage, newMessage) => {
    const logChannel = client.channels.cache.get(logChannelId);

    if (logChannel) {
        const embed = new MessageEmbed()
            .setColor('#3498db')
            .setTitle(`Menssage Edit`)
            .addField('Autor', newMessage.author.tag);

        if (oldMessage.content && oldMessage.content.trim() !== '') {
            embed.addField('<:utilitychannel:1183420384247304283> ・ Old Message', oldMessage.content);
        }

        if (newMessage.content && newMessage.content.trim() !== '') {
            embed.addField('<:utilitychannel:1183420384247304283> ・ New Message', newMessage.content);
        }

        embed
            .setFooter(`${newMessage.guild.name} | Moderation`)
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    }
});

client.on('messageDeleteBulk', (messages) => {
    const logChannel = client.channels.cache.get(logChannelId);

    if (logChannel) {
        const embed = new MessageEmbed()
            .setColor('#e74c3c')
            .setTitle('Bulk Message Deletion')
            .addField('Number of Messages Deleted', messages.size.toString(), true)
            .addField('Deletion Date', new Date().toLocaleString(), true)
            .setFooter(`${messages.first().guild.name} | Moderation`)
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    }
});

//ROLE LOG

client.on('roleCreate', (role) => {
    const logChannel = client.channels.cache.get(logChannelId);

    if (logChannel) {
        const embed = new MessageEmbed()
            .setColor('#27ae60')
            .setTitle('Role Created')
            .addField('Role Name', role.name)
            .addField('Role ID', role.id)
            .setFooter(`${role.guild.name} | Moderation`)
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    }
});


client.on('roleDelete', (role) => {
    const logChannel = client.channels.cache.get(logChannelId);

    if (logChannel) {
        const embed = new MessageEmbed()
            .setColor('#e74c3c')
            .setTitle('Role Deleted')
            .addField('Role Name', role.name)
            .addField('Role ID', role.id)
            .setFooter(`${role.guild.name} | Moderation`)
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    }
});

function getRoleChanges(oldRole, newRole) {
    const changes = [];

    if (oldRole.name !== newRole.name) {
        changes.push(`Name: ${oldRole.name} ➔ ${newRole.name}`);
    }

    if (oldRole.color !== newRole.color) {
        changes.push(`Color: ${oldRole.hexColor} ➔ ${newRole.hexColor}`);
    }

    return changes.join('\n');
}

client.on('guildMemberUpdate', (oldMember, newMember) => {
    const logChannel = client.channels.cache.get(logChannelId);

    if (logChannel) {
        const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
        if (addedRoles.size > 0) {
            const embed = new MessageEmbed()
                .setColor('#27ae60')
                .setTitle('Roles Given')
                .addField('Member', newMember.user.tag, true)
                .addField('Roles Given', addedRoles.map(role => role.name).join(', '), true)
                .setFooter(`${newMember.guild.name} | Moderation`)
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        }
    }
});

client.on('guildMemberUpdate', (oldMember, newMember) => {
    const logChannel = client.channels.cache.get(logChannelId);

    if (logChannel) {
        const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
        if (removedRoles.size > 0) {
            const embed = new MessageEmbed()
                .setColor('#e74c3c')
                .setTitle('Roles Removed')
                .addField('Member', newMember.user.tag, true)
                .addField('Roles Removed', removedRoles.map(role => role.name).join(', '), true)
                .setFooter(`${newMember.guild.name} | Moderation`)
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        }
    }
});


//GUILD LOG

client.on('guildBanAdd', (guild, user) => {
    const logChannel = client.channels.cache.get(logChannelId);

    if (logChannel) {
        const embed = new MessageEmbed()
            .setColor('#e74c3c')
            .setTitle('Member Banned')
            .addField('Member', user.tag, true)
            .addField('Member ID', user.id, true)
            .addField('Date', new Date().toLocaleString(), true)
            .addField('Reason', 'No Reason Give')
            .setFooter(`${guild.name} | Moderation`)
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    }
});

client.on('guildBanRemove', (guild, user) => {
    const logChannel = client.channels.cache.get(logChannelId);

    if (logChannel) {
        const embed = new MessageEmbed()
            .setColor('#2ecc71')
            .setTitle('Member Unbanned')
            .addField('Member', user.tag, true)
            .addField('Member ID', user.id, true)
            .addField('Unban Date', new Date().toLocaleString(), true)
            .setFooter(`${guild.name} | Moderation`)
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    }
});

client.on('guildUpdate', (oldGuild, newGuild) => {
    const logChannel = client.channels.cache.get(logChannelId);

    if (logChannel) {
        const embed = new MessageEmbed()
            .setColor('#3498db')
            .setTitle('Server Updated')
            .addField('Old Name', oldGuild.name, true)
            .addField('New Name', newGuild.name, true)
            .addField('Change Date', new Date().toLocaleString(), true)
            .setFooter(`${newGuild.name} | Moderation`)
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    }
});

//CHANEL LOGS

client.on('channelCreate', (channel) => {
    const logChannel = client.channels.cache.get(logChannelId);

    if (logChannel) {
        const embed = new MessageEmbed()
            .setColor('#2ecc71')
            .setTitle('Channel Created')
            .addField('Channel Name', channel.name, true)
            .addField('Channel ID', channel.id, true)
            .addField('Channel Type', channel.type, true)
            .addField('Creation Date', new Date().toLocaleString(), true)
            .setFooter(`${channel.guild.name} | Moderation`)
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    }
});

client.on('channelDelete', (channel) => {
    const logChannel = client.channels.cache.get(logChannelId);

    if (logChannel) {
        const embed = new MessageEmbed()
            .setColor('#e74c3c')
            .setTitle('Channel Deleted')
            .addField('Channel Name', channel.name, true)
            .addField('Channel ID', channel.id, true)
            .addField('Channel Type', channel.type, true)
            .addField('Deletion Date', new Date().toLocaleString(), true)
            .setFooter(`${channel.guild.name} | Moderation`)
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    }
});

//SPEACIAL CHANNELS

const boostChannelId = 'ID_DEL_CANAL_MEJORAS'; // Reemplaza con el ID de tu canal de Boost

client.on('guildMemberBoost', (member) => {
    const boostChannel = client.channels.cache.get(boostChannelId);

    if (boostChannel) {
        const boostCount = member.guild.premiumSubscriptionCount;
        const boostLevel = member.guild.premiumTier;

        const embed = new MessageEmbed()
            .setColor('#3498db')
            .setTitle('🚀 | Thank You for Your Boost!')
            .setDescription(`Thank you, ${member.user}, for boosting the server!\nCurrently, there are ${boostCount} boosts, and we are at Boost Level ${boostLevel}. Thank you for your support!`)
            .setFooter(`${member.guild.name} | Moderation`)
            .setTimestamp();

        boostChannel.send({ embeds: [embed] });
    }
});

const guildDeleteChannelId = 'ID_DEL_CANAL_GUILD_REMOVE';

client.on('guildDelete', async (guild) => {
    const guildDeleteChannel = client.channels.cache.get(guildDeleteChannelId);

    if (guildDeleteChannel) {
        const guildOwner = await guild.fetchOwner();
        const memberCount = guild.memberCount;

        const embed = new MessageEmbed()
            .setColor('#e74c3c')
            .setTitle('👋 | Left a Server')
            .setDescription(`We've left a server.\nServer Name: ${guild.name}\nServer ID: ${guild.id}\nOwner: ${guildOwner.user.tag}\nMember Count: ${memberCount}\n\n😢 We'll miss you!`)
            .setFooter(`Left at ${new Date().toLocaleString()} | Moderation`)
            .setTimestamp();

        guildDeleteChannel.send({ embeds: [embed] });
    }
});

const guildAddChannelId = 'ID_DEL_CANAL_GUILD_ADD';

client.on('guildCreate', async (guild) => {
    const guildAddChannel = client.channels.cache.get(guildAddChannelId);

    if (guildAddChannel) {
        const guildOwner = await guild.fetchOwner();
        const memberCount = guild.memberCount;

        const embed = new MessageEmbed()
            .setColor('#27ae60')
            .setTitle('🌟 | New Server Joined!')
            .setDescription(`We've joined a new server!\nServer Name: ${guild.name}\nServer ID: ${guild.id}\nOwner: ${guildOwner.user.tag}\nMember Count: ${memberCount}\n\n🎉 Welcome to the server!`)
            .setFooter(`Joined at ${new Date().toLocaleString()} | Moderation`)
            .setTimestamp();

        guildAddChannel.send({ embeds: [embed] });
    }
});

// VOICE LOG

const voiceChannelId = 'ID_DEL_CANAL_LOGS_VOICE'; // Reemplaza con el ID de tu canal de eventos de voz

client.on('voiceStateUpdate', (oldState, newState) => {
    const voiceEventChannel = client.channels.cache.get(voiceChannelId);

    if (voiceEventChannel) {
        if (newState.channelId && oldState.channelId !== newState.channelId) {
            const embedJoin = new MessageEmbed()
                .setColor('#27ae60')
                .setTitle('🔊 | User Joined/Left Voice Channel')
                .setDescription(`**${newState.member.user.tag}** joined/left the voice channel **${newState.channel.name}**.`)
                .setFooter(`${newState.member.guild.name} | Voice Activity`)
                .setTimestamp();

            voiceEventChannel.send({ embeds: [embedJoin] });
        }
        if (oldState.serverMute !== newState.serverMute) {
            const action = newState.serverMute ? 'muted' : 'unmuted';

            const embedMute = new MessageEmbed()
                .setColor(newState.serverMute ? '#e74c3c' : '#3498db')
                .setTitle(`🔇 | User ${action}`)
                .setDescription(`**${newState.member.user.tag}** was ${action} in the voice channel **${newState.channel.name}**.`)
                .setFooter(`${newState.member.guild.name} | Voice Activity`)
                .setTimestamp();

            voiceEventChannel.send({ embeds: [embedMute] });
        }
    }
});

// EVENT LOG ERRORS

const webhookURL = 'YOUR_WEBHOOK;

const errorWebhook = new WebhookClient({ url: webhookURL });

client.on('error', (error) => {
    console.error('Error:', error);
    const embed = new MessageEmbed()
        .setColor('#e74c3c')
        .setTitle('🚨 | Error Logs')
        .setDescription(`\`\`\`js\n${error.stack}\n\`\`\``)
        .setFooter('Error Logging | Moderation')
        .setTimestamp();

    errorWebhook.send({ embeds: [embed] });
});
