/*
s

class menu = new Menu('song-menu', ({interaction, client, menu}, songData) => {
    const [state, setState] = menu.useState(0);
    const artistButton = menu.useButton(artist, onArtistButton)
    const playlistButton = menu.useButton(playlist, onPlaylistButton)
    const cancelButton = menu.useButton(cancel, onCancelButton)
    const playlistSelect = menu.useButton(playlsitDrop, onPlaylistSelect)
    const createPlaylistModal = menu.useButton(createModal, onPlaylistModal)


    const onArtistButton = (i) => i.reply(link);
    const onPlaylistButton = (i) => setPage(1);
    const onCancelButton = (i) => setPage(0);
    const onPlaylistSelect = (i) => {
        if (i.value == 'new') i.showModal(createPlaylistModal)
        addToPlaylist(interaction.value)
        i.channel.send('playlist added!')
    }
    const onPlaylistModal = (i) => {
        currentComponents = compPage1
        i.reply('created new playlist!')
    }   

    const compPage1 = row(artistButton, playlistButton)
    const compPage2 = [row(playlistSelect), row(cancelButton)]
    const compPages = [compPage1, compPage2];

    return () => {
        content: 'sdsd',
        embeds: [new embed(songembed)],
        components: {
            if (page==1){
                firstPage(onArtist, onPlaylist)
            }else if(page==2){
                secondPage(onArtist, onPlaylist)
            }
        },
    }
}),
(i, id) => {
    return songDataFromID(id);
}
)



...
songMenu = menu.new(songdata.id, songData);
message.send(songMenu.render())
*/