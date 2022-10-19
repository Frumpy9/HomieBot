/*
s

export default menu = ({interaction, client}, songData) => {
    const artistButton = button(artist, onArtistButton)
    const playlistButton = button(playlist, onPlaylistButton)
    const cancelButton = button(cancel, onCancelButton)
    const playlistSelect = dropdown(playlsitDrop, onPlaylistSelect)
    const createPlaylistModal = modal(createModal, onPlaylistModal)

    const compPage1 = row(artistButton, playlistButton)
    const compPage2 = [row(playlistSelect), row(cancelButton)]
    let currentComponents = compPage1
    
    const onArtistButton = (i) => i.reply(link);
    const onPlaylistButton = (i) => currentComponents = compPage2
    const onCancelButton = (i) => currentComponents = compPage1
    const onPlaylistSelect = (i) => {
        if (i.value == 'new') i.showModal(createPlaylistModal)
        addToPlaylist(interaction.value)
        i.channel.send('playlist added!')
    }
    const onPlaylistModal = (i) => {
        currentComponents = compPage1
        i.reply('created new playlist!')
    }

    return {
        content: 'sdsd',
        embeds: [new embed(songembed)],
        components: currentComponents,
    }
})

*/