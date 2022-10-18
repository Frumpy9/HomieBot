import { ButtonBuilder } from "@discordjs/builders";
import { ButtonStyle, GuildMember } from "discord.js";
import { Button } from "../../structs/Component";


export default new Button((songData) => 
    new ButtonBuilder()
    .setLabel(`More songs by ${songData.artists[0].name}`)
    .setStyle(ButtonStyle.Secondary)
).setCallback(async ({interaction}, url) => {
    await interaction.reply({ content: url, ephemeral: true })
}).setName('artist_button');