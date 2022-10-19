import { SelectMenuBuilder } from "@discordjs/builders";
import { spotify } from "../..";
import { Menu } from "../../structs/Component";
import createPlaylist from '../modals/createPlaylist'
import artist from "../buttons/artist";
import addToPlaylist from "../buttons/addToPlaylist";
import { ActionRowBuilder, MessageActionRowComponentBuilder } from "discord.js";

export default new Menu(async (name) => {
    const playlists = await spotify.getMe()
        .then((d) => spotify.getUserPlaylists(d.body.id))
        .then(d => d.body);

    let options: any[] = [];
    playlists.items.forEach(i => 
        options.push({
            label: i.name,
            description: i.description,
            value: i.id
        })
    )

    options.push({
            label: 'Create new homie playlist',
            description: `Add ${name} to new playlist`,
            value: 'new'
    })
    
    return new SelectMenuBuilder()
    .setPlaceholder(`Select a homie playlist for ${name}`)
    .setMaxValues(1)
    .setMinValues(1)
    .addOptions(options)
}).setCallback(async ({interaction}, artistId, songId) => {
    const value = interaction.values[0];
    if (value == 'new'){
        return interaction.showModal(await createPlaylist.render([artistId, songId]))
    }

    await spotify.addTracksToPlaylist(interaction.values[0], ['spotify:track:'+songId]);
    const artistButton = await artist.render([artistId]);
    const playlistButton = await addToPlaylist.render([artistId, songId])
    await interaction.update({
        components: [new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents([artistButton, playlistButton])]
    })
    await interaction.channel?.send({ content: `${interaction.member?.toString()} added this song to a homie playlist!`})
}).setName('playlist_menu');