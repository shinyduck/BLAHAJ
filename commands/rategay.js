const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('rategay')
    .setDescription('let the bot rate how gay.')
    .addUserOption(option =>
		option.setName('user')
			.setDescription('select the user for the bot to rate gay.')
			.setRequired(true)),
    async execute(interaction) {
        var rating = Math.floor(Math.random() * 100)
        interaction.reply({
            content: `${interaction.options.getUser('user')} is ${rating}% gay`,
            ephemeral: false,
        })
    },
}