import { ButtonBuilder } from "@discordjs/builders";
import { ActionRowBuilder, ButtonStyle, GuildMember, MessageActionRowComponentBuilder } from "discord.js";
import { Button } from "../../structs/Component";
import playlistMenu from "../menus/playlistMenu";


export default new Button((name) =>
    new ButtonBuilder()
    .setLabel(`Add ${name} to a homie playlist`)
    .setStyle(ButtonStyle.Secondary)
).setCallback(async ({interaction}, uri, name) => {const menu = await playlistMenu.render([uri], name);
    await interaction.reply({ 
        content: '', 
        ephemeral: true, 
        components: [new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents([menu])]
    })
}).setName('playlist_button');