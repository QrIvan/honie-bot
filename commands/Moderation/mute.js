const { Permissions, MessageEmbed, TextChannel } = require('discord.js');
const Mute = require('../../database/models/muteModel');

module.exports = {
    name: 'mute',
    category: 'Moderation',
    aliases: [],
    description: 'Mutes a user.',
    usage: 'mute @user|ID [time] [reason]',
    examples: ["mute @QrIvan 1h30m Test", "mute 828991790324514887 1d Test"],
    run: async (client, message, args) => {
        if (!message.member.permissions.has(Permissions.FLAGS.MUTE_MEMBERS)) {
            const noPermissionEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('**MUTE** | Permission Denied')
                .setDescription('You do not have permissions to use this command.');
            return message.reply({ embeds: [noPermissionEmbed] });
        }
        let target = message.mentions.members.first();

        if (!target) {
            const userId = args[0];

            if (!userId || !/^\d+$/.test(userId)) {
                const invalidUserEmbed = new MessageEmbed()
                    .setColor('#ff0000')
                    .setTitle('**MUTE** | Invalid User')
                    .setDescription('Valid use: `h/mute [@user|user_id] [time] [reason]`.');
                return message.reply({ embeds: [invalidUserEmbed] });
            }

            target = message.guild.members.cache.get(userId);

            if (!target) {
                const userNotFoundEmbed = new MessageEmbed()
                    .setColor('#ff0000')
                    .setTitle('**MUTE** | User Not Found')
                    .setDescription('No user with that ID was found on the server.');
                return message.reply({ embeds: [userNotFoundEmbed] });
            }
        }

        const muteRoleId = 'ROL_MUTED_ID'; // Reemplaza con el ID del rol de mute
        const LOGS_CHANNEL = 'CHANNEL_LOG_ID'; // Importa LOGS_CHANNEL 

        const muteRole = message.guild.roles.cache.get(muteRoleId);

        if (!muteRole) {
            const muteRoleNotFoundEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('**MUTE** | Mute Role Not Found')
                .setDescription('The mute role could not be found. Make sure to provide a valid role ID.');
            return message.reply({ embeds: [muteRoleNotFoundEmbed] });
        }

        const timeArgument = args[1];

        if (!timeArgument) {
            const noTimeEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('**MUTE** | Missing Time')
                .setDescription('Please provide a valid mute duration.');
            return message.reply({ embeds: [noTimeEmbed] });
        }

        const originalRoles = target.roles.cache.map((role) => role.id);
        await target.roles.set([]);
        try {
            await target.roles.add(muteRole);
            const muteDurationMs = parseTimeArgument(timeArgument);

            const muteSuccessEmbed = new MessageEmbed()
                .setColor('#00ff00')
                .setTitle('🔇 **MUTE** | User Muted')
                .setDescription(`${target.user.tag} has been muted successfully for **${formatTime(muteDurationMs)}**.`);
            message.reply({ embeds: [muteSuccessEmbed] });

            const muteRecord = new Mute({
                user_id: target.id,
                user_tag: target.user.tag,
                moderator_id: message.author.id,
                moderator_tag: message.author.tag,
                reason: args.slice(2).join(' ') || 'Mute-Applied',
                timestamp: new Date(),
                duration: muteDurationMs,
            });

            await muteRecord.save();

            setTimeout(async () => {
                await target.roles.remove(muteRole);
                await target.roles.set(originalRoles);
                const logChannel = message.guild.channels.cache.get(LOGS_CHANNEL);

                if (logChannel instanceof TextChannel) {
                    const unmuteEmbed = new MessageEmbed()
                        .setColor('#00ff00')
                        .setTitle('⚒️ Honie Bot | User Unmuted')
                        .setDescription(`**User unmuted:** ${target.user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** Mute duration expired`)
                        .setFooter('The user has been automatically unmuted.');

                    logChannel.send({ embeds: [unmuteEmbed] });
                } else {
                    console.error('[CONSOLE ERROR] Log channel not found.');
                }
            }, muteDurationMs);
        } catch (error) {
            console.error(error);
            const muteErrorEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('**MUTE** | Error Muting User')
                .setDescription('An error occurred while muting the user.');
            return message.reply({ embeds: [muteErrorEmbed] });
        }
    },
};

// Función para analizar el argumento de tiempo y devolver la duración en milisegundos
function parseTimeArgument(timeArgument) {
    const timeRegex = /(\d+)([hmsd]+)/g;
    let durationMs = 0;
    let match;
    while ((match = timeRegex.exec(timeArgument)) !== null) {
        const value = parseInt(match[1]);
        const unit = match[2];
        if (unit === 's') {
            durationMs += value * 1000; // segundos a milisegundos
        } else if (unit === 'm') {
            durationMs += value * 60 * 1000; // minutos a milisegundos
        } else if (unit === 'h') {
            durationMs += value * 60 * 60 * 1000; // horas a milisegundos
        } else if (unit === 'd') {
            durationMs += value * 24 * 60 * 60 * 1000; // días a milisegundos
        }
    }

    return durationMs;
}

function formatTime(durationMs) {
    const duration = {
        days: Math.floor(durationMs / (1000 * 60 * 60 * 24)),
        hours: Math.floor((durationMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((durationMs % (1000 * 60)) / 1000),
    };

    const formattedDuration = [];
    if (duration.days > 0) {
        formattedDuration.push(`${duration.days}d`);
    }
    if (duration.hours > 0) {
        formattedDuration.push(`${duration.hours}h`);
    }
    if (duration.minutes > 0) {
        formattedDuration.push(`${duration.minutes}m`);
    }
    if (duration.seconds > 0) {
        formattedDuration.push(`${duration.seconds}s`);
    }

    return formattedDuration.join(' ');
}
