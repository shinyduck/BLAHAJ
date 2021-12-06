const fetch = require("node-fetch")
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const { token } = require("../config.json")
/*
//Using dotenv
const dotenv = require('dotenv').config();
*/

module.exports = {
    data: new SlashCommandBuilder()
    .setName('youtube-together')
    .setDescription('watch youtube in a voice channel together.'),
    async execute(interaction) {
        if(!interaction.member.voice?.channel) return interaction.reply({ content: 'Connect to a Voice Channel', ephemeral: true });

        fetch(`https://discord.com/api/v8/channels/${interaction.member.voice.channel.id}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 300, // time in seconds
                max_uses: 20,
                target_application_id: "880218394199220334",
                target_type: 2,
                temporary: true,
                validate: null
            }),
            headers: {
                Authorization: `Bot ${token}`,
                //Authorization: `Bot ${process.env.TOKEN}`,
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
        .then(invite => {
            if (!invite.code) return interaction.reply({ content: "An error occured while retrieving data", ephemeral: true })

            const joinbutton = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setStyle('LINK')
                        .setLabel('Start Watching')
                        .setURL(`https://discord.com/invite/${invite.code}`),
                );

            return interaction.reply({ content: `https://discord.com/invite/${invite.code}`, components: [joinbutton] });
        })
    },
}