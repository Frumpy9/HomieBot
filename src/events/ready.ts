import { Event } from "../structs/Event"

export default new Event('ready', () => {
    console.log("Bot is ready!");
})