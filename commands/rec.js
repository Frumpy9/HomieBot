const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rec-song')
        .setDescription('Create song recommendation')
        .addStringOption((option) => option.setName("name").setDescription("The name of the song").setRequired(true)),
    async excecute(interaction) {
        const name = interaction.options.getString("name");

        await interaction.reply(`mf said ${name}. lol`)
    }
}