import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../structs/Command";

export default new Command()
    .setName('ping')
    .setDescription('replies with pong')
    .setExecute(async ({interaction, options}) => {
        interaction.followUp("Pong");
    });