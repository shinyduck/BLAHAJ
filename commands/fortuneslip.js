const { SlashCommandBuilder } = require('@discordjs/builders');

const schedule = require('node-schedule');
const { fortuneSlipEmbed } = require('../fortuneslipembeds');
// Create new empty variable called 'claimeddailyfortuneslip'
var claimeddailyfortuneslip = new Set();
//var i = 0

// schedule job reset At 04:00 (0 4 * * *) CRON
schedule.scheduleJob('0 4 * * *', () => {
    claimeddailyfortuneslip = new Set();
    //i = (i + 1)
    console.log('dailyfortuneslip reset', new Date().toString())
    //console.log(i)
});

/*
// schedule reset At every minute - for testing purposes (* * * * *) CRON
schedule.scheduleJob('* * * * *', () => {
    claimeddailyfortuneslip = new Set();
    //i = (i + 1)
    console.log('dailyfortuneslip reset', new Date().toString())
    //console.log(i)
});
*/

module.exports = {
    data: new SlashCommandBuilder()
    .setName('fortuneslip')
    .setDescription('claim your daily fortune slip. (resets at 4AM)'),
    async execute(interaction) {
        if (claimeddailyfortuneslip.has(interaction.user.id)) {
            interaction.reply({
                content: `You've already gotten one today. Please try again tomorrow... ${interaction.user} (resets at 4AM)`,
                ephemeral: true,
            });
        } else {
            let randomEmbed = fortuneSlipEmbed[Math.floor(Math.random() * fortuneSlipEmbed.length)];
            interaction.reply({ embeds: [randomEmbed] });
            claimeddailyfortuneslip.add(interaction.user.id);
        }
    },
}
