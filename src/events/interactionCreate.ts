import { CommandInteractionOptionResolver, Interaction, InteractionType } from "discord.js";
import { stringify } from "querystring";
import { client } from "..";
import { ExtendedClient } from "../structs/Client";
import { Event } from "../structs/Event";
import { ExtendedInteraction } from "../types/Command";
import { ComponentTypes } from "../types/Component";

export default new Event('interactionCreate', async (interaction) => {
    interaction.type
    if (interaction.isCommand()) {
        //await interaction.deferReply();
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        command.execute({
            client,
            interaction: interaction as ExtendedInteraction,
            options: interaction.options as CommandInteractionOptionResolver
        })
    } else if (interaction.isButton()) {
        callComponent(client, interaction, ComponentTypes.button);
    } else if (interaction.isSelectMenu()) {
        callComponent(client, interaction, ComponentTypes.menu);
    } else if (interaction.type == InteractionType.ModalSubmit){
        callComponent(client, interaction, ComponentTypes.modal);
    }
})

const callComponent = async (client: ExtendedClient, interaction: any, type: ComponentTypes) => {
    const { customId } = interaction;
    
    const ids = customId.split('#');
    const menu = client.menus.get(ids[0]);
    if (menu){
        return await menu.handleInteraction({interaction, client}, {menuId: ids[0], instanceId: ids[1], componentId: ids[2]});
    }

    const components = client.components.get(type);
    if (!components) return console.error('no components found');
    
    const embeddedArgs = customId.split('#');
    const name = embeddedArgs.shift();
    if (!name) return console.error("didnt get name");
    //if (client.collectors.e(name)) return;
    if (client.collectors.has(customId)) return;

    const component = components.get(name);
    if (!component) return console.error(`couldnt find command ${embeddedArgs[0]}`);

    try {
        await component.callback({ interaction, client }, ...embeddedArgs);
    } catch (error) {
        console.error(error);
    }
}