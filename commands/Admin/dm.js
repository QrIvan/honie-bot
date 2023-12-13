const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'dm',
    category: 'Admin',
    aliases: ['message', 'messagebot', "md"],
    description: 'Send a direct message to a user.',
    usage: 'dm @user|ID <message>',
    examples: ["dm @QrIvan Test", "dm 828991790324514887 Test"],
    run: async (client, message, args, prefix) => {

        // Check if the user has permission to use this command
        if (!message.guild) {
            const serverOnlyEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('`sytem@user/perms/dm`\n<:Honie_Moderator:1180623912497860728> **DIRECT MESSAGE** | Denied')
                .setDescription('This command can only be used on a server.')
            return message.reply({ embeds: [serverOnlyEmbed] });
        }

        const member = message.guild.members.cache.get(message.author.id);

        if (!member || !member.permissions.has('ADMINISTRATOR')) {
            const permissionEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('`sytem@user/perms/dm`\n<:Honie_Moderator:1180623912497860728> **DIRECT MESSAGE** | Permission Denied')
                .setDescription('You do not have permissions to use this command.')


            return message.reply({ embeds: [permissionEmbed] });
        }

        // Check if a mentioned user or ID is provided
        let user = message.mentions.users.first();
        const userID = args[0];
        if (!user && userID) {
            user = client.users.cache.get(userID);
        }

        if (!user) {
            const validUseEmbed = new MessageEmbed()
                .setColor('#ff6600')
                .setTitle('`sytem@user/error/dm`\n<:Moderator_Logo:1183460215782391828> **DIRECT MESSAGE** | **Valid Usage**')
                .setDescription('Valid use: `h/dm [@user|user_id] [message]`.')


            return message.reply({ embeds: [validUseEmbed] });
        }

        // Check if a valid message is provided
        const content = args.slice(1).join(' ');

        if (!content) {
            const validUseEmbed = new MessageEmbed()
                .setColor('#ff6600')
                .setTitle('`sytem@user/error/dm`\n<:Moderator_Logo:1183460215782391828> **DIRECT MESSAGE** | Valid Usage')
                .setDescription('Valid use: `h/dm [@user|user_id] [message]`.')


            return message.reply({ embeds: [validUseEmbed] });
        }

        // Create an embed for the message
        const embed = new MessageEmbed()
            .setTitle('`sytem@user/new/dm`\n<a:uh_stafflogo:1183420465902006273> | Direct Message')
            .setDescription(content)
            .setFooter("🛈 Honie Bot | Administration Team.")
            .setColor('#910e0e')
            .setTimestamp();

        try {
            // Send the direct message to the user as an embed
            await user.send({ embeds: [embed] });
            message.reply(`<:utility12:1183420388580012094> **Success** | Message sent to **${user.tag}**`);
        } catch (error) {
            console.error("[CONSOLE ERROR] #%d", error);
            const errorEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('`sytem@user/error/dm`\n<:Moderator_Logo:1183460215782391828> **DIRECT MESSAGE** | **Error**')
                .setDescription('The direct message could not be sent to the user.')


            message.reply({ embeds: [errorEmbed] });
        }
    }
}
