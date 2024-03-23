module.exports = {
    name: 'eval',
    category: 'Admin',
    aliases: ['e'],
    description: 'Evaluate JavaScript code.',
    usage: 'eval <código>',
    examples: ['eval 2 + 2', 'eval message.author.username'],
    run: async (client, message, args, prefix) => {

        if (message.author.id !== '828991790324514887') return; // Reemplaza con tu ID de Discord

        try {
            const code = args.join(' ');
            if (!code) {
                return message.reply('**EVAL** | Valid use: `eval <code>`.');
            }
            let evaled = eval(code);



            if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);

            message.reply(`Status:\n\`\`\`js\n${evaled}\n\`\`\``);
        } catch (error) {
            message.reply(`Error:\n\`\`\`js\n${error}\n\`\`\``);
        }
    },
};
