const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    name: 'purge',
    aliases: ['clear', 'delete'],
    description: 'Clear the channel.',
    usage: 'h/purge [amount]',
    examples: ["purge 1", "clear 100"],
    category: 'Moderation',
    run: async (client, message, args, prefix) => {
        // Check user permissions
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            const noPermissionEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('`sytem@user/perms/purge`\n<:Moderator_Logo:1183460215782391828> **PURGE** | Permission Denied')
                .setDescription('You do not have permissions to use this command.');
            return message.reply({ embeds: [noPermissionEmbed] });
        }

        if (isNaN(args[0])) {
            const invalidAmountEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('`sytem@user/error/purge`\n<:Moderator_Logo:1183460215782391828> **PURGE** | Invalid Amount')
                .setDescription('Valid use: `h/purge [amount]`.');
            return message.reply({ embeds: [invalidAmountEmbed] });
        }

        const amount = parseInt(args[0]);

        if (amount < 1 || amount > 100) {
            const amountOutOfRangeEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('`sytem@user/error/purge`\n<:Moderator_Logo:1183460215782391828> **PURGE** | Amount Out of Range')
                .setDescription('Valid use: `h/purge [amount] (Max. 100)`..');
            return message.reply({ embeds: [amountOutOfRangeEmbed] });
        }

        // Perform message purge
        message.channel.bulkDelete(amount)
            .then(messages => {
                const deletedCount = messages.size;

                // Get the log channel from the config
                const canalDeRegistrosId = '1183447592395350128'; // Reemplaza con el ID del canal de registros

                // Get the log channel
                const logChannel = message.guild.channels.cache.get(canalDeRegistrosId);

                if (logChannel && logChannel.type === 'text') {
                    // Send a log message in the log channel
                    const logEmbed = new MessageEmbed()
                        .setColor('#00ff00')
                        .setTitle('`sytem@user/modlog/purge`\n🗑️ Honie Bot | Messages Deleted')
                        .setDescription(`**Deleted Message Count:** ${deletedCount}\n**Moderator:** ${message.author.tag}`)
                        .setTimestamp();

                    logChannel.send({ embeds: [logEmbed] });
                }

                // Send a confirmation message
                const confirmationEmbed = new MessageEmbed()
                    .setColor('#00ff00')
                    .setDescription(`<:utility12:1183420388580012094> **PURGE** | Deleted \`${deletedCount}/${amount}\` messages.`);

                message.channel.send({ embeds: [confirmationEmbed] })
                    .then(msg => {
                        // Delete the confirmation message after 10 seconds
                        setTimeout(() => {
                            msg.delete().catch(() => null);
                        }, 10000);
                    })
                    .catch(() => null);
            })
            .catch(error => {
                console.error(error);
                const purgeErrorEmbed = new MessageEmbed()
                    .setColor('#ff0000')
                    .setTitle('`sytem@user/error/purge`\n<:Moderator_Logo:1183460215782391828> **Error** | Error Deleting Messages')
                    .setDescription('You can only bulk delete messages that are under 14 days old.');
                message.reply({ embeds: [purgeErrorEmbed] });
            });
    },
};
