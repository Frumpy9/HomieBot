const { SlashCommandBuilder, ThreadAutoArchiveDuration, EmbedBuilder } = require('discord.js');
const { spotifyApi } = require('../spotify');
const { getAverageColor } = require('fast-average-color-node');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('rec-song')
        .setDescription('Create song recommendation')
        .addStringOption((option) => option.setName("url").setDescription("url of song").setRequired(true)),
    async execute(interaction) {
        const url = interaction.options.getString("url");
        const forum = interaction.guild.channels.cache.get('1031337709568020600');

        const songID = url.split('/').pop().split('?')[0];
        let songData;

        await spotifyApi.getTrack(songID).then(
            (data) => {
                songData = data.body
            },
            async (err) => {
                await interaction.reply({ content: "Couldn't find song!", ephemeral: true })
                console.error(err);
                return;
            }
        );

        const color = await getAverageColor(songData.album.images[2].url);

        await forum.threads.create({
            name: songData.name + ' -- ' + interaction.member.displayName,
            autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
            message: {
                content: interaction.member.toString() + ' recommended **' + songData.name + ' by ' + 
                songData.artists[0].name + '**\n' + songData.external_urls.spotify,
            },
            reason: 'Needed a separate thread for food',
        })
        .then((t) => {
            const embed = createSongEmbed(songData, interaction.member).setColor(color.hex);
            t.send({embeds: [embed], content: ''});
        })
        .catch(console.error);



        await interaction.reply({ content: `mf said ${songData.name}. lol`, ephemeral: true })
    }
}

const createSongEmbed = (data, member) => {
    const {album, name, external_urls, artists, duration_ms} = data;
    // const {displayName, displayAvatarURL} = member;

    const embed = new EmbedBuilder()
    .setAuthor({name: member.displayName, iconURL: member.displayAvatarURL()})
    .setTitle(name + ' by ' + artists[0].name)
    .setURL(external_urls.spotify)
    .setThumbnail(album.images[2].url)
    .addFields([
            {
                "name": "Artists",
                "value": artists.map((artist) => "["+artist.name+"]("+artist.external_urls.spotify+")").join('\n'),
                "inline": true
            },
            {
                "name": "Album",
                "value": "["+album.name+"]("+album.external_urls.spotify+")",
                "inline": true
            },
            {
                "name": "Duration",
                "value": millisToMinutesAndSeconds(duration_ms),
                "inline": false
            }
    ])
    .setFooter({text: 'released'})
    .setTimestamp(new Date(album.release_date));

    return embed;
}

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return (
        seconds == 60 ?
        (minutes+1) + ":00" :
        minutes + ":" + (seconds < 10 ? "0" : "") + seconds
      );
  }