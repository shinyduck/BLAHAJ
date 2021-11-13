const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, NoSubscriberBehavior } = require('@discordjs/voice');
const { yt_validate } = require('play-dl');
const play = require('play-dl');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('plays a song from youtube.')
    .addStringOption(option =>
		option.setName('query')
			.setDescription('url/search.')
			.setRequired(true)),
    async execute(interaction, args) {
        if(!interaction.member.voice?.channel) return interaction.reply({ content: 'Connect to a Voice Channel', ephemeral: true });

        const query = interaction.options.getString('query')
        const check = yt_validate(query)

        if(!check) { // Invalid URL
            interaction.reply({ content: 'Invalid URL or no results', ephemeral: true });
        }
        
        else if(check === "video") { //URL is video url
            let yt_info = await play.video_info(query)
            let stream = await play.stream(query)

            console.log(`${interaction.user.tag} played ${query} in ${interaction.member.voice.channel.name}`);

            const connection = joinVoiceChannel({   
                channelId: interaction.member.voice.channel.id,
                guildId: interaction.channel.guild.id,
                adapterCreator: interaction.channel.guild.voiceAdapterCreator,
            });
            
            const resource = createAudioResource(stream.stream, {
                inputType: stream.type
            });
            const player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Play
                }
            });
    
            player.play(resource);
    
            connection.subscribe(player);
    
            await interaction.reply(`Now Playing: **${yt_info.video_details.title}** [**${yt_info.video_details.durationRaw}**] in ${interaction.member.voice.channel}\n${query}`);
        
            player.on(AudioPlayerStatus.Idle, () => {
                player.stop()
                interaction.followUp('Finished playing')
            })
        }
        
        else if(check === "playlist") { //URL is a playlist url
            interaction.reply({ content: 'Playlist feature work in progress', ephemeral: true });
        }

        else if(check === "search") { // Given term is not a video ID and PlayList ID.
            console.log(query)
            let searchresults = await play.search(query, { limit : 1, source : { youtube : "video"}})
            let yt_info = await play.video_info(searchresults[0].url)
            let stream = await play.stream(searchresults[0].url)
            
            console.log(`${interaction.user.tag} searched for ${query} in ${interaction.member.voice.channel.name} url: ${searchresults[0].url}`);

            const connection = joinVoiceChannel({   
                channelId: interaction.member.voice.channel.id,
                guildId: interaction.channel.guild.id,
                adapterCreator: interaction.channel.guild.voiceAdapterCreator,
            });
            
            const resource = createAudioResource(stream.stream, {
                inputType: stream.type
            });
            const player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Play
                }
            });
    
            player.play(resource);
    
            connection.subscribe(player);
    
            await interaction.reply(`Now Playing: **${yt_info.video_details.title}** [**${yt_info.video_details.durationRaw}**] in ${interaction.member.voice.channel}\n${searchresults[0].url}`);
        
            player.on(AudioPlayerStatus.Idle, () => {
                player.stop()
                interaction.followUp('Finished playing')
            })
        }
    },
}