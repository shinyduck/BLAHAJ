const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('screenshot')
    .setDescription('takes a screenshot of any webpage.')
    .addStringOption(option => option.setName('url').setDescription('screenshot <URL>').setRequired(true)),

    async execute(interaction) {

        const urls = interaction.options.getString('url');
        const site = /^(https?:\/\/)/i.test(urls) ? urls : `http://${urls}`;

        try {
            const searchEmbed = new MessageEmbed()
                .setColor('RANDOM')
                .setTitle(`Screenshot from: *${site}*`)
                .setImage(`https://api-fg.ddns.net/api/v3/news/screenshot?url=${site}`)

            console.log(`${interaction.user.tag} in #${interaction.channel.name} screenshotted ${urls} and got ${site}.`);
            return interaction.reply({ embeds: [searchEmbed] });
        
        } catch (err) {
            null
        }
    },  
};