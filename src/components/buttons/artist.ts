import { ButtonBuilder } from "@discordjs/builders";
import { ButtonStyle, GuildMember } from "discord.js";
import { Button } from "../../structs/Component";


export default new Button(() => 
    new ButtonBuilder()
    .setLabel(`More songs by artist`)
    .setStyle(ButtonStyle.Secondary)
).setCallback(async ({interaction}, artistId) => {
    await interaction.reply({ content: 'https://open.spotify.com/artist/'+artistId, ephemeral: true })
}).setName('artist_button');