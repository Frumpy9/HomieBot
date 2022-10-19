import { ButtonBuilder } from "@discordjs/builders";
import { ActionRowBuilder, ButtonStyle, GuildMember, MessageActionRowComponentBuilder } from "discord.js";
import { Button } from "../../structs/Component";
import addToPlaylist from "./addToPlaylist";
import artist from "./artist";


export default new Button(() => 
    new ButtonBuilder()
    .setLabel(`X`)
    .setStyle(ButtonStyle.Danger)
).setCallback(async ({interaction}, artistId, songId) => {
    const artistButton = await artist.render([artistId]);
    const playlistButton = await addToPlaylist.render([artistId, songId])
    await interaction.update({
        components: [new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents([artistButton, playlistButton])]
    })
}).setName('cancel_button');