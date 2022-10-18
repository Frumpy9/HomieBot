import { CommandInteractionOptionResolver } from "discord.js";
import { client } from "..";
import { Event } from "../structs/Event";
import { ExtendedInteraction } from "../types/Command";

export default new Event('interactionCreate', async (interaction) => {
    interaction.type
    if (interaction.isCommand()){
        //await interaction.deferReply();
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        command.execute({
            client, 
            interaction: interaction as ExtendedInteraction, 
            options: interaction.options as CommandInteractionOptionResolver
        })
    }else if (interaction.isButton()){
        const {buttons} = client;
        const {customId} = interaction;
        const embeddedArgs = customId.split('#');
        const name = embeddedArgs.shift();
        if (!name) return console.error("didnt get name");
        const button = buttons.get(name);
        if (!button) return console.error(`couldnt find command ${embeddedArgs[0]}`);

        try {
            await button.callback({interaction, client}, ...embeddedArgs);
        } catch (error) {
            console.error(error);
        }
        
    }
})