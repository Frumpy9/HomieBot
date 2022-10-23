import { ModalBuilder } from "@discordjs/builders";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  InteractionType,
  MessageActionRowComponentBuilder,
  SelectMenuBuilder,
  SelectMenuInteraction,
  SelectMenuOptionBuilder,
} from "discord.js";
import { spotify } from "..";
import {
  componentId,
  InteractionData,
  Menu,
  MenuInstance,
} from "../structs/Menu";

export default new Menu(
  "song",
  async (menu: MenuInstance, song: SpotifyApi.SingleTrackResponse) => {
    const [page, setPage] = menu.useState(0);
    const [loading, setLoading] = menu.useState(false);
    const [playlists, setPlaylists] = menu.useState([]);
    const [playlistIndex, setPlaylistIndex] = menu.useState(0);
    const [dropdown, setDropdown] = menu.useState(false);

    const onMore = async (i: InteractionData) =>
      await i.interaction.reply({
        content: song.artists[0].external_urls.spotify,
        ephemeral: true,
      });
    const onPlaylists = async (i: InteractionData) => {
      setLoading(true);
      setPage(1);
      return loadPlaylists().then(r => {
        setPlaylists(r);
        setLoading(false);
      });
    };
    const onForward = (i: InteractionData) => setPlaylistIndex(playlistIndex + 1);
    const onBack = (i: InteractionData) => setPlaylistIndex(Math.max(playlistIndex - 1, 0));
    const onCancel = (i: InteractionData) => setPage(0);
    const onAdd = async (i: InteractionData) => await i.interaction.reply({ content: 'adding playlist', ephemeral: true });
    const onCreate = async (i: InteractionData) => await i.interaction.reply({ content: 'creating playlist', ephemeral: true });
    const onDropdown = (i: InteractionData) => setDropdown(!dropdown);
    const onSelect = (i: InteractionData) => {
      const interaction = i.interaction as SelectMenuInteraction;
      setPlaylistIndex(Number(interaction.values[0]));
    }

    const songEmbed = createSongEmbed(song);
    let playlistEmbed = null;
    if (page == 1 && !loading) {
      playlistEmbed = createPlaylistEmbed(playlists[playlistIndex]);
    }

    let components: any[];
    if (page == 0) {
      components = [new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents([
        menu.addComponent(
          "more",
          new ButtonBuilder()
            .setLabel("More songs by artist")
            .setStyle(ButtonStyle.Secondary),
          onMore
        ),
        menu.addComponent(
          "playlists",
          new ButtonBuilder()
            .setLabel("Add to Homie playlist")
            .setEmoji("1033485234513137695")
            .setStyle(ButtonStyle.Success),
          onPlaylists
        )])
      ]
    } else {
      components = [new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents([
        menu.addComponent(
          "cancel",
          new ButtonBuilder()
            .setEmoji("1033570231404204152")
            .setStyle(ButtonStyle.Danger),
          onCancel
        ),
        menu.addComponent(
          "back",
          new ButtonBuilder()
            .setEmoji("1033483469268996146")
            .setStyle(ButtonStyle.Secondary),
          onBack
        ),
        menu.addComponent(
          "forward",
          new ButtonBuilder()
            .setEmoji("1033483908760748122")
            .setStyle(ButtonStyle.Secondary),
          onForward
        ),
        menu.addComponent(
          "add",
          new ButtonBuilder()
            .setEmoji("1033548041749282926")
            .setStyle(ButtonStyle.Success),
          onAdd
        ),
        menu.addComponent(
          "dropdown",
          new ButtonBuilder()
            .setEmoji(!dropdown ? "1033550366287069284" : "1033550246485164093")
            .setStyle(ButtonStyle.Primary),
          onDropdown
        ),
      ])]
    }

    if (page == 1 && dropdown){
      components.push(
        new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents([
          menu.addComponent(
            "select",
            buildSelectMenu(playlists, song.name),
            onSelect
          )
        ]),
        new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents([
          menu.addComponent(
            "new",
            new ButtonBuilder()
            .setLabel("New")
              .setStyle(ButtonStyle.Success),
            onCreate
          )
        ])
      )
    }

    if (loading) components = [];

    return {
      content: '',
      embeds: (loading) ? [loadingEmbed()] : (page == 1 ? [playlistEmbed] : [songEmbed]),
      components
    };
  },
  async (i: InteractionData, id: componentId) => {
    const songId = id.instanceId;
    const { interaction } = i;
    const song = (await spotify.getTrack(songId).then(
      (data) => data.body,
      async (err) =>
        await interaction.reply({
          content: "Couldn't find song!",
          ephemeral: true,
        })
    )) as SpotifyApi.SingleTrackResponse;

    return song;
  }
);

const buildSelectMenu = (playlists: SpotifyApi.SinglePlaylistResponse[], name: string) => {
  const options: any[] = []
  playlists.forEach((playlist,i) => 
    options.push({
        label: playlist.name,
        description: playlist.description,
        value: i.toString()
    })
  )
  
  return new SelectMenuBuilder()
    .setPlaceholder(`Select a homie playlist for ${name}`)
    .setMaxValues(1)
    .setMinValues(1)
    .addOptions(options)
}

const loadingEmbed = () =>
  new EmbedBuilder()
    //.setAuthor({ name: 'Homie Bot'})
    //.setTitle('Loading')
    .setImage('https://media.tenor.com/On7kvXhzml4AAAAi/loading-gif.gif')
//.setDescription('please wait...')


const createPlaylistEmbed = (playlist: SpotifyApi.SinglePlaylistResponse) => {
  const { name, external_urls, images, tracks, description, owner } = playlist;
  //console.log(playlist.tracks.items[0].track);

  const songsList = tracks.items
    .map(
      (t) => {
        const track = t.track!;
        return "[" + track.name + "](" + track.external_urls.spotify + ")"
      }
    )
    .join(", ")

  return (
    new EmbedBuilder()
      .setTitle(name)
      .setDescription(description + '\n\n**Songs**\n' + songsList)
      .setURL(external_urls.spotify)
      .setImage(images[0].url)
  );
}

const createSongEmbed = (songData: SpotifyApi.SingleTrackResponse) => {
  const { name, artists, album, external_urls, duration_ms } = songData;

  const millisToMinutesAndSeconds = (millis: number) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return +seconds == 60
      ? minutes + 1 + ":00"
      : minutes + ":" + (+seconds < 10 ? "0" : "") + seconds;
  };

  return (
    new EmbedBuilder()
      //.setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL() })
      .setTitle(name + " by " + artists[0].name)
      .setURL(external_urls.spotify)
      .setImage(album.images[2].url)
      .addFields([
        {
          name: "Artists",
          value: artists
            .map(
              (artist) =>
                "[" + artist.name + "](" + artist.external_urls.spotify + ")"
            )
            .join("\n"),
          inline: true,
        },
        {
          name: "Album",
          value: "[" + album.name + "](" + album.external_urls.spotify + ")",
          inline: true,
        },
        {
          name: "Duration",
          value: millisToMinutesAndSeconds(duration_ms),
          inline: false,
        },
      ])
      .setFooter({ text: "Released" })
      .setTimestamp(new Date(album.release_date))
  );
};

const loadPlaylists = async () => {
  let playlists: SpotifyApi.SinglePlaylistResponse[] = [];
  const playlistsShallow = await spotify
    .getMe()
    .then((d) => spotify.getUserPlaylists(d.body.id))
    .then((d) => d.body.items);

  for (let i = 0; i < playlistsShallow.length; i++) {
    const p = playlistsShallow[i];
    const playlist = (await spotify.getPlaylist(p.id)).body;
    playlists.push(playlist);
  }

  return playlists;
};
