import { CommandInteractionOptionResolver } from "discord.js";
import { client } from "..";
import { Event } from "../structs/Event";
import { ExtendedInteraction } from "../types/Command";

export default new Event('interactionCreate', async (interaction) => {
    if (interaction.isCommand()){
        //await interaction.deferReply();
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        command.execute({
            client, 
            interaction: interaction as ExtendedInteraction, 
            options: interaction.options as CommandInteractionOptionResolver
        })
    }
})