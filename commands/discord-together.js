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
    .setName('discord-together')
    .setDescription('start a discord together activity.')
    .addStringOption(option => option.setName('activity').setDescription('select an activity').setRequired(true)
            .addChoice('Poker', '755827207812677713')
            .addChoice('Chess', '832012774040141894')
            .addChoice('Checkers', '832013003968348200')
            .addChoice('Betrayal', '773336526917861400')
            .addChoice('Fishing', '814288819477020702')
            .addChoice('Lettertile', '879863686565621790')
            .addChoice('Wordsnack', '879863976006127627')
            .addChoice('Doodlecrew', '878067389634314250')
            .addChoice('Spellcast', '852509694341283871')
            .addChoice('Awkword', '879863881349087252')
            .addChoice('Puttparty', '763133495793942528')),

    async execute(interaction) {
        if(!interaction.member.voice?.channel) return interaction.reply({ content: 'Connect to a Voice Channel', ephemeral: true });

        const activity = interaction.options.getString('activity');

        fetch(`https://discord.com/api/v8/channels/${interaction.member.voice.channel.id}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 300, // time in seconds
                max_uses: 20,
                target_application_id: activity,
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
                        .setLabel('Join Activity')
                        .setURL(`https://discord.com/invite/${invite.code}`),
                );

            return interaction.reply({ content: `https://discord.com/invite/${invite.code}`, components: [joinbutton] });
        })
    },
}