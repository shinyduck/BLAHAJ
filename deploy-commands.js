const { REST } = require('@discordjs/rest');
const fs = require('fs');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

/*
//Using dotenv
const dotenv = require('dotenv').config();
*/

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));


for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}


const rest = new REST({ version: '9' }).setToken(token);

/*
//Using dotenv
const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
*/

(async () => {
	try {
		// Registering Guild commands
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);
		
		/*
		// Registering Global commands
		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);
		*/

		console.log('Successfully registered application commands.');
	} catch (error) {
		console.error(error);
	}
})();

/*
//Using dotenv
(async () => {
	try {
		// Registering Guild commands
		await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
			{ body: commands },
		);
		
		/*
		// Registering Global commands
		await rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID),
			{ body: commands },
		);
		*/

		console.log('Successfully registered application commands.');
	} catch (error) {
		console.error(error);
	}
})();
*/
