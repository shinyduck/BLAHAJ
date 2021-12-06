const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('stops the player and leaves the voice channel.'),
    async execute(interaction) {
        if(!interaction.member.voice?.channel) return interaction.reply({ content: 'Connect to a Voice Channel', ephemeral: true });
        
        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.channel.guild.id,
            adapterCreator: interaction.channel.guild.voiceAdapterCreator,
        });
        
        connection.destroy()
        await interaction.reply(`Left ${interaction.member.voice.channel}`);
    },
}
