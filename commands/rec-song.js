import { SlashCommandBuilder, ThreadAutoArchiveDuration, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { spotifyApi } from '../spotify.js';
import {getAverageColor} from 'fast-average-color-node'
import config from '../config.json' assert {type: 'json'}
const { forumID } = config

export const data = new SlashCommandBuilder()
	.setName("rec-song")
	.setDescription("Create song recommendation")
	.addStringOption((option) => option.setName("url").setDescription("url of song").setRequired(true))

export const execute = async (interaction) => {
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
	let threadID;

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
			threadID = t.id;
			t.send({ embeds: [embed], content: "", components: [row] });
		})
		.catch(console.error);

	await interaction.reply({ content: "Created song recommendation: <#" + threadID + ">", ephemeral: true });
}

export const onButton = async (interaction, params) => {
	const url = params[0];
	await interaction.reply({ content: url, ephemeral: true });
}

const createSongEmbed = (data, member) => {
	const { album, name, external_urls, artists, duration_ms } = data;

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

function millisToMinutesAndSeconds(millis) {
	var minutes = Math.floor(millis / 60000);
	var seconds = ((millis % 60000) / 1000).toFixed(0);
	return seconds == 60 ? minutes + 1 + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}
