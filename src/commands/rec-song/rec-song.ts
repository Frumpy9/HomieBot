import { Command } from "../../structs/Command";
import { spotify } from "../..";
import { getAverageColor } from "fast-average-color-node";
import { ActionRowBuilder, AnyComponentBuilder, APIActionRowComponent, APIMessageActionRowComponent, ButtonBuilder, ButtonComponent, ButtonStyle, ColorResolvable, ComponentBuilder, ComponentType, EmbedBuilder, ForumChannel, GuildMember, MessageActionRowComponentBuilder, RESTOAuth2AdvancedBotAuthorizationQueryResult, ThreadAutoArchiveDuration } from "discord.js";
import ArtistButton from "../../components/buttons/artist";
import addToPlaylist from "../../components/buttons/addToPlaylist";
import song from "../../menus/song";

export default new Command()
    .setName("rec-song")
    .setDescription("Create song recommendation")
    .addStringOption((option) => option.setName("url").setDescription("url of song").setRequired(true))
    .setExecute(async ({ interaction, options }) => {
        const url = options.getString('url');
        const forumID = process.env.forumID;
        if (!url || !forumID) return;
        const forum = interaction.guild?.channels.cache.get(forumID) as ForumChannel;

        const songID = url.split("/").pop()?.split("?")[0];
        if (!songID) return;

        let songData = await spotify.getTrack(songID).then(
            (data) => (data.body),
            async (err) => (await interaction.reply({ content: "Couldn't find song!", ephemeral: true }))
        ) as SpotifyApi.SingleTrackResponse;

        const playlists = await spotify.getMe()
        .then((d) => spotify.getUserPlaylists(d.body.id))
        .then(d => d.body);

        if (!songData) return;

        const color = await getAverageColor(songData.album.images[2].url);

        const threadID = await forum?.threads
            .create({
                name: `${songData.name} - ${songData.artists[0].name}`,
                autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
                message: {
                    content: 
                        `${interaction.member.toString()} recommended `+
                        `**${songData.name} by ${songData.artists[0].name}**\n`+
                        `${songData.external_urls.spotify}`
                },
                reason: "Song recommended through HomieBot by: " + interaction.member.displayName
            })
            .then(async (t) => {
                const songMenu = song.new(songData.id, songData);
                t.send(await songMenu.send());
                return t.id;
            })
            .catch(console.error);

        await interaction.reply({ content: "Created song recommendation: <#" + threadID + ">", ephemeral: true });
    });