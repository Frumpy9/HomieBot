const { SlashCommandBuilder, ThreadAutoArchiveDuration } = require('discord.js');
const {spotifyApi} = require('../spotify');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('rec-song')
        .setDescription('Create song recommendation')
        .addStringOption((option) => option.setName("name").setDescription("The name of the song").setRequired(true)),
    async execute (interaction) {
        const name = interaction.options.getString("name");
        const forum = interaction.guild.channels.cache.get('1031337709568020600');
        forum.threads.create({
            name: name,
            autoArchiveDuration: ThreadAutoArchiveDuration.ThreeDays,
            message: {
             content: 'Test channel',
            },
            reason: 'Needed a separate thread for food',
          })
          .then(threadChannel => console.log(threadChannel))
          .catch(console.error);

          spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
            function(data) {
              console.log('Artist albums', data.body);
            },
            function(err) {
              console.error(err);
            }
          );

        await interaction.reply(`mf said ${name}. lol`)
    }
}