
export const name = 'ready'
export const once = true
export const execute = async (bot) => {
	console.log(`Ready! Logged in as ${bot.user.tag}`)
}