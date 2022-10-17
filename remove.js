//https://discordjs.guide/creating-your-bot/deleting-commands.html#deleting-specific-commands


const commandID = "x"//ID for the command you want to remove 






const { REST, Routes } = require('discord.js');
const { clientID, guildID, token } = require('./config.json');

const rest = new REST({ version: '10' }).setToken(token);

// ...

// for guild-based commands
rest.delete(Routes.applicationGuildCommand(clientID, guildID, commandID))
	.then(() => console.log('Successfully deleted guild command'))
	.catch(console.error);