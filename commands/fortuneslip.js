const { SlashCommandBuilder, inlineCode } = require('@discordjs/builders');

const Cron = require("croner");
const { fortuneSlipEmbed } = require('../fortuneslipembeds');

// Create new empty variable called 'claimeddailyfortuneslip'
var claimeddailyfortuneslip = new Set();

// schedule dailyfortuneslipreset reset At 04:00 (0 4 * * *) CRON GMT+8 corresponding to Genshin Impact daily Asia server reset
const dailyfortuneslipreset = Cron(
	'0 4 * * *', 
	{ 
		maxRuns: Infinity, 
		timezone: "Asia/Singapore"
	},
	function() {
        claimeddailyfortuneslip = new Set();
		console.log('dailyfortuneslip reset', new Date().toString());
	}
);

module.exports = {
    data: new SlashCommandBuilder()
    .setName('fortuneslip')
    .setDescription('claim your daily fortune slip. (resets at 4AM)'),
    async execute(interaction) {
        if (claimeddailyfortuneslip.has(interaction.user.id)) {
            interaction.reply({
                content: `You've already gotten one today. Please try again tomorrow... ${interaction.user} [**${msToHoursMinutesAndSeconds(dailyfortuneslipreset.msToNext())}**] till next reset\nNext reset at: ${inlineCode(dailyfortuneslipreset.next())}`,
                ephemeral: true,
            });
        } else {
            let randomEmbed = fortuneSlipEmbed[Math.floor(Math.random() * fortuneSlipEmbed.length)];
            interaction.reply({ embeds: [randomEmbed] });
            claimeddailyfortuneslip.add(interaction.user.id);
        }
    },
}

function msToHoursMinutesAndSeconds(ms){
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    //const day = hour * 24;
    
    let seconds = Math.floor(ms / second % 60);
    let minutes = Math.floor(ms / minute % 60);
    let hours = Math.floor(ms / hour % 24);
    //let days = Math.floor(ms / day);
    
    return  hours + "h " + minutes + "m " + seconds + "s";
}