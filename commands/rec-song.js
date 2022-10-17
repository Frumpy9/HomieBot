const { SlashCommandBuilder, ThreadAutoArchiveDuration, EmbedBuilder } = require('discord.js');
const { spotifyApi } = require('../spotify');


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
            function (data) {
                songData = data.body
            },
            function (err) {
                console.error(err);
            }
        );

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
            //let embed = new EmbedBuilder().setDescription('anything in there');
            let embed = {
                "title": songData.name+ " by " + songData.artists[0].name,
                "description": "",
                "color": 48028,
                "timestamp": new Date(songData.album.release_date),
                "url": songData.external_urls.spotify,
                "author": {
                    "name": interaction.member.displayName,
                    //"url": "https://discord.com",
                    "icon_url": interaction.member.displayAvatarURL()
                },
                "thumbnail": {
                    "url": songData.album.images[2].url
                },
                // "image": {
                //     "url": ""
                // },
                "footer": {
                    "text": "Released",
                    //"icon_url": ""
                },
                "fields": [
                    {
                        "name": "Artists",
                        "value": songData.artists.map((artist) => "["+artist.name+"]("+artist.external_urls.spotify+")").join('\n'),
                        "inline": true
                    },
                    {
                        "name": "Album",
                        "value": "["+songData.album.name+"]("+songData.album.external_urls.spotify+")",
                        "inline": true
                    },
                    {
                        "name": "Duration",
                        "value": millisToMinutesAndSeconds(songData.duration_ms),
                        "inline": false
                    }
                ]
            }
            t.send({embeds: [embed], content: ''});
        })
        .catch(console.error);



        await interaction.reply({ content: `mf said ${songData.name}. lol`, ephemeral: true })
    }
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