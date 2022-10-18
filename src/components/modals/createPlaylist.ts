import { SelectMenuBuilder } from "@discordjs/builders";
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { spotify } from "../..";
import { Modal } from "../../structs/Component";

export default new Modal(async (name) => {
    const title = new TextInputBuilder()
        .setCustomId('title')
        .setLabel('Title of new playlist')
        .setRequired(true)
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('Title')

    const description = new TextInputBuilder()
        .setCustomId('description')
        .setLabel('Description of new playlist')
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder('Description')

    return new ModalBuilder()
        .setTitle(`Add ${name} to new playlist`)
        .addComponents([
            new ActionRowBuilder<TextInputBuilder>().setComponents([title]),
            new ActionRowBuilder<TextInputBuilder>().setComponents([description])
        ])
}).setCallback(async ({ interaction }, uri, name) => {
    const title = interaction.fields.getTextInputValue('title');
    const description = interaction.fields.getTextInputValue('description');
    const playlist = await spotify.createPlaylist(title, { 
        'description': description, 'public': true 
    }).then(d => d.body.id);
    await spotify.addTracksToPlaylist(playlist, [uri]);
    await interaction.reply({ content: `added song to new playlist: ${title}!`, ephemeral: true })
}).setName('playlist_modal');