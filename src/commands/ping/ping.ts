import { ActionRowBuilder, ButtonBuilder, ComponentType, MessageActionRowComponentBuilder, MessageComponentBuilder, SlashCommandBuilder } from "discord.js";
import { client } from "../..";
import test from "../../components/buttons/test";
import { Command } from "../../structs/Command";

export default new Command()
    .setName('ping')
    .setDescription('replies with pong')
    .setExecute(async ({ interaction, options }) => {
        const testString = 'from command scope';
        const button = await test.render([]);
        const collector = (await interaction.reply({ components: [new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents([button])] }))
        .createMessageComponentCollector({componentType: ComponentType.Button, time: 10000});
        collector.on('collect', i => {
            console.log(testString);
            
            i.reply({content: 'button is live!', ephemeral: true})
        });

        collector.on('end', collected => {
            client.collectors.delete(test.name);
            console.log(`Collected ${collected.size} interactions.`);
        });
    });