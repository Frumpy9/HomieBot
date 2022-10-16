const fs = require("fs")

const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientID, guildID, token } = require('./config.json');

const commands = []
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"))//gets all commands in /commands

for (const file of commandFiles) {//pushes each command from /commands to arr to be sent do discord
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}


const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands(clientID, guildID),
			{ body: commands },
		);

		console.log('Successfully registered application commands.');
	} catch (error) {
		console.error(error);
	}
})();