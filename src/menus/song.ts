import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, InteractionType, MessageActionRowComponentBuilder } from "discord.js";
import { spotify } from "..";
import { componentId, InteractionData, Menu, MenuInstance } from "../structs/Menu";
import { Spotify } from "../structs/Spotify";

interface SongMenuProps{
    song: SpotifyApi.SingleTrackResponse,
    playlists: SpotifyApi.ListOfUsersPlaylistsResponse
}

export default new Menu('song', async (menu: MenuInstance, song : SpotifyApi.SingleTrackResponse) => { 
    const [page, setPage] = menu.useState(0);
    const [loading, setLoading] = menu.useState(false);
    const [playlists, setPlaylists] = menu.useState([]);

    const onMore = (i: InteractionData) => i.interaction.reply({content: song.artists[0].external_urls.spotify, ephemeral: true});
    const onAdd = (i: InteractionData) => {
        setLoading(true);
        setPage(1);

        return loadPlaylists().then(playlists=>{
            setLoading(false);
            setPlaylists(playlists);
        });
    }
    const onBack = (i: InteractionData) => setPage(0);

    const songEmbed = createSongEmbed(song);
    console.log('loading: '+loading);
    console.log('page: '+page);

    return {
        content: (loading? 'Loading' : ''),
        embeds: loading? [] : [songEmbed],
        components: [new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents(page == 0 ?
            [menu.addComponent('more', new ButtonBuilder()
                .setLabel('More songs by '+song.artists[0].name)
                .setStyle(ButtonStyle.Secondary),
                onMore),
            menu.addComponent('add', new ButtonBuilder()
                .setLabel('Add '+song.name+' to homie playlist')
                .setStyle(ButtonStyle.Secondary),
                onAdd)]
            :
            [menu.addComponent('back', new ButtonBuilder()
                .setLabel('⬅')
                .setStyle(ButtonStyle.Secondary),
                onBack)]
        )]
    }
},
    async (i: InteractionData, id: componentId) => {
        const songId = id.instanceId;
        const {interaction} = i;
        const song = await spotify.getTrack(songId).then(
            (data) => (data.body),
            async (err) => (await interaction.reply({ content: "Couldn't find song!", ephemeral: true }))
        ) as SpotifyApi.SingleTrackResponse;

        return  song;
    }
)

const createSongEmbed = (songData: SpotifyApi.SingleTrackResponse) => {
    const { name, artists, album, external_urls, duration_ms } = songData;

    const millisToMinutesAndSeconds = (millis: number) => {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return +seconds == 60 ? minutes + 1 + ":00" : minutes + ":" + (+seconds < 10 ? "0" : "") + seconds;
    }

    return new EmbedBuilder()
        //.setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL() })
        .setTitle(name + " by " + artists[0].name)
        .setURL(external_urls.spotify)
        .setThumbnail(album.images[2].url)
        .addFields([
            {
                name: "Artists",
                value: artists.map((artist) => "[" + artist.name + "](" + artist.external_urls.spotify + ")").join("\n"),
                inline: true
            },
            {
                name: "Album",
                value: "[" + album.name + "](" + album.external_urls.spotify + ")",
                inline: true
            },
            {
                name: "Duration",
                value: millisToMinutesAndSeconds(duration_ms),
                inline: false
            }
        ])
        .setFooter({ text: "Released" })
        .setTimestamp(new Date(album.release_date));
}

const loadPlaylists = async (): Promise<Object> => {
    const playlists = await spotify.getMe()
        .then((d) => spotify.getUserPlaylists(d.body.id))
        .then(d => d.body);

    return playlists;
}  
