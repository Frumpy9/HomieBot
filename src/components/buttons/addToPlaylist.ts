import { ButtonBuilder } from "@discordjs/builders";
import { ButtonStyle, GuildMember } from "discord.js";
import { Button } from "../../structs/Component";


export default new Button((name) => 
    new ButtonBuilder()
    .setLabel(`Add ${name} to a homie playlist`)
    .setStyle(ButtonStyle.Secondary)
).setCallback(async ({interaction}, songID) => {
    await interaction.reply({ content: songID, ephemeral: true })
}).setName('playlist_button');