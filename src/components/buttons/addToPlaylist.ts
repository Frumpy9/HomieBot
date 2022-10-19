import { ButtonBuilder } from "@discordjs/builders";
import { ActionRowBuilder, ButtonStyle, GuildMember, MessageActionRowComponentBuilder } from "discord.js";
import { Button } from "../../structs/Component";
import playlistMenu from "../menus/playlistMenu";
import cancel from "./cancel";


export default new Button(() =>
    new ButtonBuilder()
    .setLabel(`Add this song to a homie playlist`)
    .setStyle(ButtonStyle.Secondary)
).setCallback(async ({interaction}, artistId, songId) => {
    const menu = await playlistMenu.render([artistId, songId]);
    const cancelButton = await cancel.render([artistId, songId]);
    await interaction.update({
        components: [
            new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents([cancelButton]),
            new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents([menu])
        ]
    })
}).setName('playlist_button');