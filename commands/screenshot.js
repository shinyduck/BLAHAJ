const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('screenshot')
    .setDescription('takes a screenshot of any webpage.')
    .addStringOption(option => option.setName('url').setDescription('screenshot <URL>').setRequired(true)),

    async execute(interaction) {

        const url = interaction.options.getString('url');

        try {
            const searchEmbed = new MessageEmbed()
                .setColor('RANDOM')
                .setTitle(`Screenshot from: *${url}*`)
                .setImage(`https://api-fg.ddns.net/api/v3/news/screenshot?url=${url}`)

            console.log(`${interaction.user.tag} in #${interaction.channel.name} screenshotted ${url}`);
            return interaction.reply({ embeds: [searchEmbed] });
        
        } catch (err) {
            null
        }
    },  
};
