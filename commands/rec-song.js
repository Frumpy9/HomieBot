const { SlashCommandBuilder, ThreadAutoArchiveDuration, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { spotifyApi } = require("../spotify");
const { getAverageColor } = require("fast-average-color-node");

const{ forumID } = require("../config.json")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("rec-song")
		.setDescription("Create song recommendation")
		.addStringOption((option) => option.setName("url").setDescription("url of song").setRequired(true)),
	async execute(interaction) {
		const url = interaction.options.getString("url");
		const forum = interaction.guild.channels.cache.get(forumID);

		const songID = url.split("/").pop().split("?")[0];
		let songData;

		await spotifyApi.getTrack(songID).then(
			(data) => {
				songData = data.body;
			},
			async (err) => {
				await interaction.reply({ content: "Couldn't find song!", ephemeral: true });
				console.error(err);
				return;
			}
		);

		const color = await getAverageColor(songData.album.images[2].url);
		let threadId;

		await forum.threads
			.create({
				name: songData.name + " - " + songData.artists[0].name,
				autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
				message: {
					content:
						interaction.member.toString() +
						" recommended **" +
						songData.name +
						" by " +
						songData.artists[0].name +
						"**\n" +
						songData.external_urls.spotify
				},
				reason: "Song recommended through HomieBot by: " + interaction.member.displayName
			})
			.then((t) => {
				const row = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId("rec-song#" + songData.artists[0].external_urls.spotify)
						.setLabel("More songs from " + songData.artists[0].name)
						.setStyle(ButtonStyle.Secondary)
				);
				const embed = createSongEmbed(songData, interaction.member).setColor(color.hex);
				threadId = t.id;
				t.send({ embeds: [embed], content: "", components: [row] });
			})
			.catch(console.error);

		await interaction.reply({ content: "Created song recommendation: <#" + threadId + ">", ephemeral: true });
	},
	async onButton(interaction, params) {
		const url = params[0];
		await interaction.reply({ content: url, ephemeral: true });
	}
};

const createSongEmbed = (data, member) => {
	const { album, name, external_urls, artists, duration_ms } = data;
	// const {displayName, displayAvatarURL} = member;

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
		.setFooter({ text: "released" })
		.setTimestamp(new Date(album.release_date));

	return embed;
};

function millisToMinutesAndSeconds(millis) {
	var minutes = Math.floor(millis / 60000);
	var seconds = ((millis % 60000) / 1000).toFixed(0);
	return seconds == 60 ? minutes + 1 + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}
