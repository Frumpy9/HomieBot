module.exports = {
	name: 'ready',
	once: true,
	async execute(bot) {
		console.log(`Ready! Logged in as ${bot.user.tag}`);
	},
};