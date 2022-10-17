import fs from 'fs'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import config from './config.json' assert {type: 'json'}
const { clientID, guildID, token } = config

const commands = []
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"))//gets all commands in /commands

for (const file of commandFiles) {//pushes each command from /commands to arr to be sent do discord
	const command = await import(`./commands/${file}`);
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