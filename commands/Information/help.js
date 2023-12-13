const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");
const { readdirSync } = require("fs");
const wait = require('node:timers/promises').setTimeout;
const config = require("../../config.json");

module.exports = {
    name: 'help',
    category: "Information",
    aliases: ["ayuda", "generalhelp", "h", "hp"],    
    description: "Displays a list of commands and their functionalities.",
    usage: "help [command]",
    examples: ["help", "ayuda", "generalhelp ping", "hp avatar", "h mute"],
    run: async (client, message, args, prefix) => {
        // Event handler to handle menu selection
        const filter = (interaction) =>
            interaction.isSelectMenu() && interaction.customId === 'help-menu';

        const collector = message.channel.createMessageComponentCollector({
            filter,
            time: 60000, // Waiting time in milliseconds (60 seconds in this case)
        });

        if (!args[0]) {
            // Filter categories and exclude "Admin" and "Development"
            const categories = client.categories.filter(cat => !['Admin', 'Development', 'Remind', 'Giveaways'].includes(cat));

            // Embed:
            const embed = new MessageEmbed()
                .setTitle("🔎・➥ Select a category from the selection menu below to view the commands.")
                .setFooter(`📬 For more information about a command, use: ${prefix}help [command]`);

            // Prefix commands menu:
            const rowMenu = new MessageActionRow()
                .addComponents([
                    new MessageSelectMenu()
                        .setCustomId("help-menu")
                        .setPlaceholder("🤖・ Click here to select a category.")
                        .addOptions(categories.map((cat) => {
                            return {
                                label: `${cat[0].toUpperCase() + cat.slice(1)}`,
                                value: cat
                            };
                        })
                    )
                ]);

            message.reply({ embeds: [embed], components: [rowMenu] }).then(async (msg) => {
                // Select menu collector:
                const filter = i => i.user.id === message.member.id;
                const collector = await msg.createMessageComponentCollector({
                    filter: filter,
                    type: "SELECT_MENU"
                });
                collector.on('collect', async (col) => {
                    await col.deferUpdate().catch(() => { });

                    try {
                        const [directory] = col.values;

                        const embedCommand = new MessageEmbed()
                            .setTitle(`🪧 Category: ${directory}`)
                            .setDescription(`The current prefix for **${message.guild.name}** is \`${prefix}\``)
                            .addFields(
                                client.commands.filter(cmd => cmd.category === directory).map((cmd) => {
                                    if (cmd) {
                                        return {
                                            name: `${cmd.name ? `\`${prefix}${cmd.name}\`:` : "unknown.js"} ${message.member.permissions.has(cmd.permissions || []) ? "" : "[Staff Only]"}`,
                                            value: `${cmd.description ? `${cmd.description}` : "> No description for this command."}`,
                                        }
                                    } else {
                                        return {
                                            name: `No commands for this directory.`,
                                            value: `** **`
                                        }
                                    }
                                })
                            );

                        msg.edit({ embeds: [embedCommand], components: [rowMenu] });
                    } catch (e) {

                    }
                });
                collector.on('end', (collected) => {
                    if (collected.size === 0) {
                        msg.delete().catch(() => { });
                        message.reply('<a:ZLogoTTM:1183420434843181126> **HELP** | Time ran out to select a category.');
                    }
                });
            });

            // If {prefix}help (command):
        } else {
            const command =
                client.commands.get(args[0].toLowerCase()) ||
                client.commands.find(
                    (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
                );

            if (!command) {
                const embed = new MessageEmbed()
                    .setDescription(`<:utility8:1183420380501778514> **HELP** | That command couldn't be found, try running the \`${prefix}help\` command.`)
                    .setColor("RED");

                return message.reply({ embeds: [embed] }).then(async (timeout) => {
                    await wait(5000);
                    message.delete().catch(() => { });
                    timeout.delete().catch(() => { });
                });
            } else {
                const embed = new MessageEmbed()
                    .setTitle(`📋 | Honie Bot - Help for "${command.name}"`)
                    .addFields(
                        { name: "Command Description", value: command.description ? command.description : "No description for this command.", inline: true },
                        { name: "Command Alias(es)", value: command.aliases ? `${command.aliases.map(al => `\`${prefix}${al}\``).join(", ") || "No aliases for this command."}` : "No aliases for this command.", inline: true },
                        { name: "Command Category", value: command.category ? `${command.category}` : "No category for this command.", inline: true },
                        { name: "Command Usage", value: command.usage ? `\`${prefix}${command.usage}\`` : `No utility for this command.`, inline: true },
                        { name: "Command Example(s)", value: command.examples.map(cmd => `\`${prefix}${cmd}\``).join(" | ") || "No examples for this command.", inline: false },
                    )
                    .setColor("BLUE");

                return message.reply({ embeds: [embed] });
            }
        }

        collector.on('end', (collected) => {
            if (collected.size === 0) {
                message.reply('<a:ZLogoTTM:1183420434843181126> **HELP** | Time ran out to select a category.');
            }
        });
    },
};
