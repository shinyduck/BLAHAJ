const { SlashCommandBuilder, inlineCode } = require('@discordjs/builders');

const Cron = require("croner");
const { fortuneSlipEmbed } = require('../fortuneslipembeds');

// Create new empty variable called 'claimeddailyfortuneslip'
var claimeddailyfortuneslip = new Set();

// schedule dailyfortuneslipreset reset At 04:00 (0 4 * * *) CRON GMT+8 corresponding to Genshin Impact daily asia server reset
const dailyfortuneslipreset = Cron(
	'* 4 * * *', 
	{ 
		maxRuns: Infinity, 
		timezone: "Asia/Singapore"
	},
	function() {
        claimeddailyfortuneslip = new Set();
		console.log('dailyfortuneslip reset', new Date().toString());
	}
);

// turning dailyfortuneslipreset.next() string into an inline code block
const inlinenextdailyfortuneslipreset = inlineCode(dailyfortuneslipreset.next());

module.exports = {
    data: new SlashCommandBuilder()
    .setName('fortuneslip')
    .setDescription('claim your daily fortune slip. (resets at 4AM)'),
    async execute(interaction) {
        if (claimeddailyfortuneslip.has(interaction.user.id)) {
            interaction.reply({
                content: `You've already gotten one today. Please try again tomorrow... ${interaction.user}\nNext reset at: ${inlinenextdailyfortuneslipreset}`,
                ephemeral: true,
            });
        } else {
            let randomEmbed = fortuneSlipEmbed[Math.floor(Math.random() * fortuneSlipEmbed.length)];
            interaction.reply({ embeds: [randomEmbed] });
            claimeddailyfortuneslip.add(interaction.user.id);
        }
    },
}
