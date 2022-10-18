import { Command } from "../../structs/Command";
import { spotify } from "../..";
import { getAverageColor } from "fast-average-color-node";
import { ActionRowBuilder, AnyComponentBuilder, APIActionRowComponent, APIMessageActionRowComponent, ButtonBuilder, ButtonComponent, ButtonStyle, ColorResolvable, ComponentBuilder, ComponentType, EmbedBuilder, ForumChannel, GuildMember, MessageActionRowComponentBuilder, RESTOAuth2AdvancedBotAuthorizationQueryResult, ThreadAutoArchiveDuration } from "discord.js";
import ArtistButton from "../../components/buttons/artist";

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
            .then((t) => {
                const button = ArtistButton.render([songData.artists[0].external_urls.spotify], songData)
                const embed = createSongEmbed(songData, interaction.member).setColor(color.hex as ColorResolvable);
                t.send({ 
                    content: '',
                    embeds: [embed],
                    components: [new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents([button])]
                });
                return t.id;
            })
            .catch(console.error);

        await interaction.reply({ content: "Created song recommendation: <#" + threadID + ">", ephemeral: true });
    });

const createSongEmbed = (data: SpotifyApi.SingleTrackResponse, member: GuildMember) => {
    const { album, name, external_urls, artists, duration_ms } = data;

    const millisToMinutesAndSeconds = (millis: number) => {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return +seconds == 60 ? minutes + 1 + ":00" : minutes + ":" + (+seconds < 10 ? "0" : "") + seconds;
    }

    const embed = new EmbedBuilder()
        .setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL() })
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

    return embed;
};