const { Permissions, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'nukechannel',
    category: 'Moderation',
    aliases: [],
    description: 'Deletes and clones a channel.',
    usage: 'h/nukechannel',
    examples: ["nuke"],
    run: async (client, message, args) => {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            const noPermissionEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('**NUKE CHANNEL** | Permission Denied')
                .setDescription('You do not have permissions to use this command.');
            return message.reply({ embeds: [noPermissionEmbed] });
        }

        const channel = message.channel;
        const position = channel.rawPosition;
        const category = channel.parent;
        const permissionOverwrites = channel.permissionOverwrites.cache;
        const newChannel = await channel.clone();
        await newChannel.setPosition(position);


        permissionOverwrites.forEach(async (overwrite, id) => {
            const target = await newChannel.permissionOverwrites.create(id, overwrite);
            if (target) {
                target.deny(overwrite.deny).allow(overwrite.allow);
            }
        });
        if (category) {
            await newChannel.setParent(category);
        }

        await channel.delete();
        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle('💣 | Channel Nuked')
            .setImage('https://cdn.discordapp.com/attachments/845672183040835595/1157510926854017117/explosion.gif?ex=6518df8e&is=65178e0e&hm=023b72dda930979cbb8a4fed73d65bab28bd7d9215666b3bc5982787b5156100&')
            .setDescription('This channel has been nuked. All previous messages have been deleted.');

        await newChannel.send({ embeds: [embed] });
    },
};
