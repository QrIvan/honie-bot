const { Permissions, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'nukechannel',
    category: 'Moderation',
    aliases: [],
    description: 'Deletes and clones a channel.',
    usage: 'h/nukechannel',
    examples: ["nuke"],
    run: async (client, message, args) => {
        // Check user permissions
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            const noPermissionEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('`sytem@user/perms/nukechannel`\n<:Moderator_Logo:1183460215782391828> **NUKE CHANNEL** | Permission Denied')
                .setDescription('You do not have permissions to use this command.');
            return message.reply({ embeds: [noPermissionEmbed] });
        }

        // Get the current channel
        const channel = message.channel;

        // Get the position of the current channel
        const position = channel.rawPosition;

        // Get the category of the current channel (if any)
        const category = channel.parent;

        // Get the permissions of the current channel
        const permissionOverwrites = channel.permissionOverwrites.cache;

        // Create a new channel with the same permissions and position
        const newChannel = await channel.clone();

        // Set the new channel's position to match the original
        await newChannel.setPosition(position);

        // Restore original permissions
        permissionOverwrites.forEach(async (overwrite, id) => {
            const target = await newChannel.permissionOverwrites.create(id, overwrite);
            if (target) {
                target.deny(overwrite.deny).allow(overwrite.allow);
            }
        });

        // Place the new channel in the same category as the original (if there was one)
        if (category) {
            await newChannel.setParent(category);
        }

        // Delete the original channel
        await channel.delete();

        // Send a confirmation message in the new channel
        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle('💣 | Channel Nuked')
            .setImage('https://cdn.discordapp.com/attachments/845672183040835595/1157510926854017117/explosion.gif?ex=6518df8e&is=65178e0e&hm=023b72dda930979cbb8a4fed73d65bab28bd7d9215666b3bc5982787b5156100&')
            .setDescription('This channel has been nuked. All previous messages have been deleted.');

        await newChannel.send({ embeds: [embed] });
    },
};
