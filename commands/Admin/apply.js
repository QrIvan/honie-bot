const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
  name: 'apply',
  category: 'Admin',
  aliases: ["application", "solicitud", "partnership"],  
  description: 'Apply for a position.',
  usage: 'apply',
  examples: ['apply'],
  run: async (client, message, args, prefix) => {
    const categoryName = 'Support Tickets'; // Reemplaza con el nombre de tu categoría
    const category = message.guild.channels.cache.find(c => c.type === 'GUILD_CATEGORY' && c.name === categoryName);

    if (!category) {
      console.error(`[CONSOLE ERROR] La categoría "${categoryName}" no fue encontrada.`);
      return message.author.send(' There was an error processing your application. Please try again later.');
    }

    const channel = await category.guild.channels.create(`${message.author.username}-application`, {
      type: 'text',
      parent: category.id,
      permissionOverwrites: [
        {
          id: message.author.id,
          allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
        },
        {
          id: category.guild.roles.everyone,
          deny: ['VIEW_CHANNEL'],
        },
      ],
    });

    const usuario = message.mentions.members.first();
    await channel.send(`@${usuario.author.id}`);

    await channel.setTopic('**¡Le deseamos mucha suerte desde el equipo administrativo!**');

    const welcomeEmbed = new MessageEmbed()
      .setTitle('Welcome to the Application Process!')
      .setDescription(`:flag_us: | Hello dear friend! Welcome to the Honie Stuidos Partner applications. Before starting, read our questions carefully and respond only with what is asked of you.\n\n* **Do not spread the questions or answers given in your application! We wish you good luck from the administrative team**.`)
      .setColor('#3498db');

    channel.send({ embeds: [welcomeEmbed] });

    const questions = [
      { name: 'What is your name?', value: 'Answer in the next message.' },
      { name: 'Why are you interested in this position?', value: 'Answer in the next message.' },
      { name: 'What relevant experience do you have?', value: 'Answer in the next message.' },
      { name: 'What relevant experience do you have?', value: 'Answer in the next message.' },
    ];

    const answers = [];

    const askQuestions = async () => {
      for (const question of questions) {
        const questionEmbed = new MessageEmbed()
          .setTitle('Application Question')
          .addField(question.name, question.value)
          .setColor('#3498db');

        await channel.send({ embeds: [questionEmbed] });

        const filter = (response) => response.author.id === message.author.id;
        const userResponse = await channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });

        const responseContent = userResponse.first().content;
        answers.push({ question: question.name, answer: responseContent });
      }
    };

    try {
      await askQuestions();

      const registroCanalID = 'registroCanalID'; // Reemplaza con el ID del canal de registro

      const registroCanal = client.channels.cache.get(registroCanalID);
      if (registroCanal) {
        const applicationEmbed = new MessageEmbed()
          .setTitle('New Application')
          .setDescription(`**Applicant:** ${message.author.tag}`)
          .addFields(answers.map(answer => ({ name: answer.question, value: answer.answer })))
          .setColor('#3498db')
          .setTimestamp();

        registroCanal.send({ embeds: [applicationEmbed] });
        message.author.send('Your application has been submitted successfully. Thank you for applying!');
      } else {
        console.error(`[CONSOLE ERROR] El canal de registro con ID ${registroCanalID} no fue encontrado.`);
        message.author.send('There was an error processing your application. Please try again later.');
      }
    } catch (error) {
      console.error(error);
      message.author.send('There was an error processing your application. Please try again later.');
    } finally {
      channel.delete();
    }
  },
};
