const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rec-song')
        .setDescription('Create song recommendation')
        .addStringOption((option) => option.setName("Name").setDescription("The name of the song").setRequired(true)),
    async excecute(interaction) {
        const name = interaction.options.getString("Name");

        await interaction.reply(`mf said ${name}. lol`)
    }
}