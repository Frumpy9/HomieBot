import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, InteractionResponse, Message, MessageActionRowComponentBuilder, MessageComponentBuilder, SlashCommandBuilder } from "discord.js";
import { client } from "../..";
import test from "../../components/buttons/test";
import song from "../../menus/song";
import { Command } from "../../structs/Command";
import { Button } from "../../structs/Component";

export default new Command()
    .setName('ping')
    .setDescription('replies with pong')
    .setExecute(async ({ interaction, options }) => {
        const testMenu = song.new('test', 'test-props')
        await interaction.reply(await testMenu.send())
    });