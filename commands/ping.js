const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('replies with pong.'),
    async execute(interaction) {
        await interaction.reply({content:'pong', ephemeral: true });
    },
}