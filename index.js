const Discord = require('discord.js');
const client = new Discord.Client({ 
  messageCacheMaxSize: 100,
  messageCacheLifetime: 240,
  messageSweepInterval: 300,
  restTimeOffset: 60,
  ws: {
    large_threshold: 1000,
    intents: 32509 // All Intents: 32767
  }
});

client.on("debug", (e) => { 
  if(e.includes('Will attempt a connection in')) console.info(e); // Incase all sessions were used...
});

let infoEmbed;

client.once('ready', () => {
  async function setupInit() {
    // Set the game as the "Watching for tags"
    client.user.setActivity(`for stickers on ${client.guilds.cache.size} servers.`, {type: "WATCHING"});
  }

  setupInit();
  setInterval(setupInit, 90000);
  console.log(`[${new Date().toDateString()}] ${client.user.username} (${client.user.id}) is ready to delete stickers for ${client.guilds.cache.size} servers!`);

  infoEmbed = new Discord.MessageEmbed()
    .setColor('#85a2f8')
    .setAuthor(client.user.username, client.user.avatarURL())
    .setDescription('This bot has a simple function, to delete annoying sticker messages. It has no commands, so it is just plug and play.\n\n**FAQ:**')
    .addField('How do I invite you?', 'You can invite me by [clicking here](https://discord.com/oauth2/authorize?client_id=817292033189216268&scope=bot+applications.commands&permissions=388160)')
    .addField('Why is it not deleting the sticker messages?', `The bot may be missing the \`MANAGE_MESSAGES\` permission.`)
    .addField('How can I access stickers?', `Discord is slowly rolling out stickers. Though there is a way to get it. [The tutorial](https://discord.mx/r8ijWRasUE.mp4) uses the following code:\`\`\`js\nwebpackJsonp.push([[999],{"l":(m,e,r)=>{for(k in r.c)(m=r.c[k].exports)&&m.default&&m.default.isDeveloper==0&&Object.defineProperty(m.default,"isDeveloper",{get:()=>1})}},[["l"]]])\`\`\``)
})

client.on('message', message => {
  if(message.author.bot) return; // Dont respond to other bots.
  if(message.mentions.users.first() && (message.mentions.users.first().id === client.user.id)) {
    // Mention embed to give a little information about it.
    message.channel.send(infoEmbed);
  }

  // Permissions Check
  if(!message.channel.permissionsFor(client.user.id).toArray().includes('MANAGE_MESSAGES')) return;
  // This could've been written better but im lazy
  if(message.content == '' && message.attachments.size == 0 && message.embeds.length == 0) { 
    message.react('❌')
    setTimeout(() => { message.delete({ reason: 'Stickers are not allowed!' }) }, 500)
  }
})

client.ws.on('INTERACTION_CREATE', (interaction) => {
  function respond(data) {
    return client.api.interactions(interaction.id, interaction.token).callback.post(data);
  }

  respond({
    data: {
      type: 4,
      data: {
        embeds: [ infoEmbed ]
      }
    }
  })
})

client.login(require('./config.json').token).catch(console.error)

// Invite link:
// https://discord.com/oauth2/authorize?client_id=817292033189216268&scope=bot+applications.commands&permissions=388160