const { MessageEmbed, Permissions } = require('discord.js');

// Define una variable para almacenar los errores
const errorLog = ['Arreglar codigos', 'Mensajes Embed', 'Permisos'];

module.exports = {
    name: 'vererrores',
    category: 'Admin',
    aliases: ['errores', 'error', 'devinfo', 'err'],    
    description: 'Show bot error log.',
    usage: 'vererrores [subcommand] [error]',
    examples: ["devinfo", "err adderror [error]", "err removeerror [error]"],
    run: async (client, message, args, prefix) => {
        // Verificar si el usuario tiene permisos de administrador o el rol específico
        const isAdmin = message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);
        const hasSpecificRole = message.member.roles.cache.has('1153053635417231422'); // Reemplaza con el ID del rol específico

        if (!isAdmin && !hasSpecificRole) {
            const noPermissionEmbed = new MessageEmbed()
                .setColor('#FF0000')
                .setTitle('`sytem@user/perms/errores`\n<:Honie_Moderator:1180623912497860728> **DEV ERRORS** | Permission Denied')
                .setDescription('You do not have permissions to use this command.');
            return message.reply({ embeds: [noPermissionEmbed] });
        }

        // Si no se proporciona ningún subcomando ni texto de error, muestra el registro de errores existente
        if (!args[0]) {
            const embed = new MessageEmbed()
                .setColor('RANDOM')
                .setTitle('`sytem@user/dev/error/list`\n<:Honie_Moderator:1180623912497860728> | Bot Error Log')
                .setDescription('Below are the bot recent errors:')
                .addField('Errores:', errorLog.join('\n') || 'No hay errores registrados.')
                .setFooter('QrIvan#0105 (828991790324514887) | (1130364294358380544)');

            return message.channel.send({ embeds: [embed] });
        }

        // Implementa el sistema de subcomandos con un switch
        const subcommand = args[0].toLowerCase();

        switch (subcommand) {
            case 'adderror':
                if (isAdmin || hasSpecificRole) {
                    const errorText = args.slice(1).join(' ');

                    if (errorText) {
                        // Agrega el error al registro
                        errorLog.push(errorText);

                        message.reply(`<:Honie_Check:1180626860682530937> **ERROR** | Error added to log: "${errorText}"`);
                    } else {
                        message.reply('<:Honie_Deny:1180627059765157990> **ERROR** | You must provide text for the error.');
                    }
                } else {
                    message.reply('<:Honie_Deny:1180627059765157990> **ERROR** | You do not have permissions to add errors to the log.');
                }
                break;
            case 'removeerror':
                if (isAdmin || hasSpecificRole) {
                    const errorToRemove = args.slice(1).join(' ');

                    if (errorToRemove) {
                        const indexToRemove = errorLog.indexOf(errorToRemove);

                        if (indexToRemove !== -1) {
                            // Quita el error del registro
                            errorLog.splice(indexToRemove, 1);

                            message.reply(`<:Honie_Check:1180626860682530937> **ERROR** | Error removed from log: "${errorToRemove}"`);
                        } else {
                            message.reply('<:Honie_Deny:1180627059765157990> **ERROR** | The specified error is not in the log.');
                        }
                    } else {
                        message.reply('<:Honie_Deny:1180627059765157990> **ERROR** | You must provide text for the error you want to remove.');
                    }
                } else {
                    message.reply('<:Honie_Deny:1180627059765157990> **ERROR** | You do not have permissions to remove errors from the registry.');
                }
                break;
            // Agrega más subcomandos aquí si es necesario
            default:
                message.reply('<:Honie_Deny:1180627059765157990> **ERROR** | | Valid use: `erradd [error]` or `errremove [error]`.');
                break;
        }
    },
};
