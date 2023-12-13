const { MessageEmbed } = require('discord.js');
async function fetchData() {
  const { default: fetch } = await import('node-fetch');
  return fetch;
}
const cheerio = require('cheerio');

async function fetchData(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    return { response, html };
  } catch (error) {
    console.error('[CONSOLE ERROR] Error fetching data:', error);
    return { response: null, html: null };
  }
}

async function getContentType(response) {
  try {
    const contentType = response.headers.get('content-type');
    if (contentType.includes('text/html')) {
      return 'Web Page';
    } else if (contentType.includes('image')) {
      return 'Image';
    } else if (contentType.includes('video')) {
      return 'Video';
    } else {
      return 'Unknown';
    }
  } catch (error) {
    console.error('[CONSOLE ERROR] Error getting content type:', error);
    return 'Unknown';
  }
}

async function checkSecurity(response) {
  try {
    const protocol = new URL(response.url).protocol;
    return protocol === 'https:' ? 'Secure' : 'Not secure';
  } catch (error) {
    console.error('[CONSOLE ERROR] Error checking link security:', error);
    return 'Unknown';
  }
}

async function getFinalDestination(response) {
  try {
    const finalDestination = response.headers.get('location');
    return finalDestination || 'No redirections';
  } catch (error) {
    console.error('[CONSOLE ERROR] Error getting final URL:', error);
    return 'Error getting final URL';
  }
}

module.exports = {
  name: 'check',
  category: 'Support',
  aliases: ['trace', 'link'],
  description: 'Track a link and provide detailed information about it.',
  usage: 'check <link>',
  examples: ['check https://example.com'],
  run: async (client, message, args, prefix) => {
    const enlace = args[0];

    if (!enlace) {
      const embedError = new MessageEmbed()
        .setColor('RED')
        .setTitle('`sytem@user/checklink/error`\n<:Moderator_Logo:1183460215782391828> | Missing Arguments')
        .setDescription('Valid use: `h/check [link]`.');

      return message.reply({ embeds: [embedError] });
    }

    const { response, html } = await fetchData(enlace);

    if (!response || !html) {
      // Handle the case where fetching data failed
      return message.reply('[ERROR] Failed to fetch data for the provided link.');
    }

    const $ = cheerio.load(html);

    const title = $('head title').text().trim();
    const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || 'Not available';
    const image = $('meta[property="og:image"]').attr('content');
    const url = enlace;

    const embedLinkInfo = new MessageEmbed()
      .setColor('BLUE')
      .setTitle('Link Information')
      .addField('Title', title || 'Not available')
      .addField('Description', description)
      .addField('URL', url);

    if (image) {
      embedLinkInfo.setImage(image);
    }

    // New section for classification and additional details
    embedLinkInfo.addField('Content Type', await getContentType(response));
    embedLinkInfo.addField('Security', await checkSecurity(response));
    embedLinkInfo.addField('Redirects to', await getFinalDestination(response));

    // Web page preview with interactive reactions
    const previewMessage = await message.reply({ embeds: [embedLinkInfo] });
    await previewMessage.react('🔍'); // Add reaction to view additional images
    await previewMessage.react('🌐'); // Add reaction to open the URL

    // Create a filter for reactions
    const filter = (reaction, user) => ['🔍', '🌐'].includes(reaction.emoji.name) && user.id === message.author.id;

    // Wait for user reaction
    const collected = await previewMessage.awaitReactions({ filter, max: 1, time: 30000, errors: ['time'] });

    // Process user reaction
    const reaction = collected.first();

    if (reaction) {
      if (reaction.emoji.name === '🔍') {
        // Add logic to display additional images
        const additionalImages = []; // Get additional images if available
        if (additionalImages.length > 0) {
          for (const additionalImage of additionalImages) {
            embedLinkInfo.setImage(additionalImage);
            await previewMessage.edit({ embeds: [embedLinkInfo] });
          }
        } else {
          const noImagesEmbed = new MessageEmbed()
            .setColor('BLUE')
            .setTitle('No additional images available.');

          await previewMessage.edit({ embeds: [noImagesEmbed] });
        }
      } else if (reaction.emoji.name === '🌐') {
        // Add logic to open the URL in the browser
        message.reply(`Opening URL: ${url}`);
      }
    }
  },
};
