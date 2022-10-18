import { SelectMenuBuilder } from "@discordjs/builders";
import { spotify } from "../..";
import { Menu } from "../../structs/Component";
import createPlaylist from '../modals/createPlaylist'

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
}).setCallback(async ({interaction}, uri, name) => {
    const value = interaction.values[0];
    if (value == 'new') return interaction.showModal(await createPlaylist.render([uri], name))
    await spotify.addTracksToPlaylist(interaction.values[0], [uri]);
    await interaction.reply({ content: 'added song to playlist!', ephemeral: true })
}).setName('playlist_menu');