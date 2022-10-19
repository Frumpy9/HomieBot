import { SelectMenuBuilder } from "@discordjs/builders";
import { ActionRowBuilder, MessageActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { spotify } from "../..";
import { Modal } from "../../structs/Component";
import addToPlaylist from "../buttons/addToPlaylist";
import artist from "../buttons/artist";

export default new Modal(async () => {
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
        .setTitle(`Add song to new playlist`)
        .addComponents([
            new ActionRowBuilder<TextInputBuilder>().setComponents([title]),
            new ActionRowBuilder<TextInputBuilder>().setComponents([description])
        ])
}).setCallback(async ({ interaction }, artistId, songId) => {
    if (!interaction.isFromMessage()) return;
    const title = interaction.fields.getTextInputValue('title');
    const description = interaction.fields.getTextInputValue('description');
    const playlist = await spotify.createPlaylist(title, { 
        'description': description, 'public': true 
    }).then(d => d.body.id);
    await spotify.addTracksToPlaylist(playlist, ['spotify:track:'+songId]);
    const artistButton = await artist.render([artistId]);
    const playlistButton = await addToPlaylist.render([artistId, songId])
    await interaction.update({
        components: [new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents([artistButton, playlistButton])]
    })
    await interaction.channel?.send({ content: `${interaction.member?.toString()} added this song to new playlist: ${title}!`})
}).setName('playlist_modal');