import { SelectMenuBuilder } from "@discordjs/builders";
import { spotify } from "../..";
import { Menu } from "../../structs/Component";

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
    
    return new SelectMenuBuilder()
    .setPlaceholder(`Select a homie playlist for ${name}`)
    .setMaxValues(1)
    .setMinValues(1)
    .addOptions(options)
}).setCallback(async ({interaction}, uri) => {await spotify.addTracksToPlaylist(interaction.values[0], [uri]);
    await interaction.reply({ content: 'added song to playlist!', ephemeral: true })
}).setName('playlist_button');