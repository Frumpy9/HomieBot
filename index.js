import fs from 'fs'

// Require the necessary discord.js classes
import { Client, GatewayIntentBits, Collection } from 'discord.js'
import config from './config.json' assert {type: 'json'}
const { token } = config

// Create a new client instance
const bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates] });

bot.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));


for (const file of commandFiles) {
	const command = await import(`./commands/${file}`)
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	bot.commands.set(command.data.name, command);
}

for (const file of eventFiles) {
	const event = await import(`./events/${file}`)
	if (event.once) {
		bot.once(event.name, (...args) => event.execute(...args));
	} else {
		bot.on(event.name, (...args) => event.execute(...args));
	}
}




// Login to Discord with your client's token
bot.login(token);