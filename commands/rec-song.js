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
            let embed = new EmbedBuilder().setDescription('anything in there');
            t.send({embeds: [embed], content: 'anything i guess'});
        })
        .catch(console.error);



        await interaction.reply({ content: `mf said ${songData.name}. lol`, ephemeral: true })
    }
}