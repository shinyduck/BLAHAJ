// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { MessageEmbed } = require('discord.js');

// const dotenv = require('dotenv');
const { token, guildId } = require('./config.json');

const { fortuneSlipEmbed } = require('./fortuneslip.js');
const schedule = require('node-schedule');
const { createAudioPlayer, createAudioResource , StreamType, demuxProbe, joinVoiceChannel, NoSubscriberBehavior, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice')
const {yt_validate, extractID} = require('play-dl')
const play = require('play-dl')
const youtube = require('play-dl')

// Create a new client instance
const client = new Client({ intents: [
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES, 
  Intents.FLAGS.GUILD_VOICE_STATES
] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);

  client.user.setActivity("'sus help' for command list", { type: 'PLAYING' })

  //guild 
  const guild = client.guilds.cache.get(guildId)

  if (guild) {
    commands = guild.commands
  } /* else {
    commands = client.application?.commands
  } */

  commands?.create({ 
    name: 'ping',
    description: 'replies with pong.',
  })

  commands?.create({ 
    name: 'rategay',
    description: 'let the bot rate how gay.',
    options: [
      {
        name: 'user',
        description: 'select the user for the bot to rate gay.',
        required: true,
        type: 6 // type 6 is USER
      }
    ]
  })

  commands?.create({ 
    name: 'fortuneslip',
    description: 'claim your daily fortune slip. (resets at 4AM)',
  })

  // Music player commands
  commands?.create({ 
    name: 'play',
    description: 'plays a song from youtube.',
    options: [
      {
        name: 'query',
        description: 'url/search.',
        required: true,
        type: 3 // type 3 is STRING
      }
    ]
  })

  commands?.create({ 
    name: 'stop',
    description: 'stops the music player and disconnects the bot.',
  })
});

// register client commands
client.on('messageCreate', message => {
  if(message.author.bot) return;

  else if (message.content === '!register') {
    commands = client.application?.commands
    console.log('Successfully registered client commands');
  }
})

// Create new empty variable called 'claimeddailyfortuneslip'
var claimeddailyfortuneslip = new Set();

// https://www.youtube.com/watch?v=StkFajPnd7w
// reset At 04:00 (0 4 * * *) CRON
schedule.scheduleJob('0 4 * * *', () => {
    claimeddailyfortuneslip = new Set();
    console.log('dailyfortuneslip reset', new Date().toString())
})

//client.queue = [];

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) {
    return
  }

  const { commandName, options } = interaction

  if (commandName === 'ping') {
    interaction.reply({
      content: 'pong',
      ephemeral: true,
    })
  } 
  
  else if (commandName === 'rategay') {
    var rating = Math.floor(Math.random() * 100)
    const usergay = options.getUser('user')
    interaction.reply({
        content: `${usergay} is ${rating}% gay`,
        ephemeral: false,
    })
  } 
  
  else if (commandName === 'fortuneslip') {
    if (claimeddailyfortuneslip.has(interaction.user.id)) {
        interaction.reply({
            content: `You've already gotten one today. Please try again tomorrow... ${interaction.user.tag} (resets at 4AM)`,
            ephemeral: true,
        });
    } else {
        let randomEmbed = fortuneSlipEmbed[Math.floor(Math.random() * fortuneSlipEmbed.length)];
        interaction.reply({ embeds: [randomEmbed] });
        claimeddailyfortuneslip.add(interaction.user.id);
    }
  } 
  
  // Music Player
  else if (commandName === 'play') {
    if (interaction.member.voice.channel?.type !== 'GUILD_VOICE') {
      return interaction.reply ('Connect to a Voice Channel')
    } 
    
    else if (interaction.member.voice.channel?.type == 'GUILD_VOICE') {
      const query = options.getString('query')
      
      const connection = joinVoiceChannel({
        channelId : interaction.member.voice.channel.id,
        guildId : interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator
      })

      let check = yt_validate(query)
      if(!check) { // Invalid URL
        interaction.reply(`Invalid URL or no results`);
      } 
      
      else if(check === "video") { //URL is video url
        let yt_info = await play.video_info(query)
        let id = extractID(query)
        
        await interaction.reply(`Started playing: **${yt_info.video_details.title}** [**${yt_info.video_details.durationRaw}**mins] https://www.youtube.com/watch?v=${id} in ${interaction.member.voice.channel}`);

        let stream = await play.stream(id)
        let resource = createAudioResource(stream.stream, {
          inputType : stream.type
        })
        let player = createAudioPlayer({
          behaviors: {
              noSubscriber: NoSubscriberBehavior.Play
          }
        })
        player.play(resource)

        connection.subscribe(player)
        
      } 
      
      else if(check === "playlist") { //URL is a playlist url
        interaction.reply(`Playlist feature work in progress`);
      
        /*
        const playlist = await playlist_info(id)
        await interaction.reply(`Started playing playlist: https://www.youtube.com/playlist?list=${id} (**${playlist.total_videos}**) in ${interaction.member.voice.channel}`);
        
        let stream = await play.stream(id)
        let resource = createAudioResource(stream.stream, {
          inputType : stream.type
        })
        let player = createAudioPlayer({
          behaviors: {
              noSubscriber: NoSubscriberBehavior.Play
          }
        })
        player.play(resource)

        connection.subscribe(player)

        
        const playlist = await playlist_info(url);

        await playlist.fetch();

        const tracks = [];

        for (let i = 1; i <= playlist.total_pages; i++) {
          playlist.page(i).forEach(track => {
            tracks.push({
              id: track.id,
              title: track.title
            });
          });
        }
        */
      } 
      
      
      else if(check === "search") { // Given term is not a video ID and PlayList ID.

        let results = await play.search(query, { limit : 1, source : { youtube : "video"}})
        let stream = await play.stream(results[0].url)
        let yt_info = await play.video_info(results[0].url)
        let id = extractID(results[0].url)
        
        await interaction.reply(`Started playing: **${yt_info.video_details.title}** [**${yt_info.video_details.durationRaw}**mins] https://www.youtube.com/watch?v=${id} in ${interaction.member.voice.channel}`);
        
        let resource = createAudioResource(stream.stream, {
            inputType : stream.type
        })
        let player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play
            }
        })
        player.play(resource)

        connection.subscribe(player)
      }
    }
  }

  else if (commandName === 'stop') {
    if (interaction.member.voice.channel?.type !== 'GUILD_VOICE') {
      return interaction.reply ('Connect to a Voice Channel')
    } 
    
    else if (interaction.member.voice.channel?.type == 'GUILD_VOICE') {
      if (interaction.member.voice.channel?.type !== 'GUILD_VOICE') {
        return interaction.reply ('Connect to a Voice Channel')
      }
      player.stop();

    }
  }
})



// Login to Discord with your client's token
//client.login(process.env.token);
client.login(token);