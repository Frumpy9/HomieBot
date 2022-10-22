import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageActionRowComponentBuilder } from "discord.js";
import { componentId, InteractionData, Menu, MenuInstance } from "../structs/Menu";




export default new Menu('test', async (menu: MenuInstance, test: string) => {
    const [page, setPage] = menu.useState(0);
    
    const onUpdate = (i: InteractionData) => setPage(1);
    const onNoUpdate = (i: InteractionData) => i.interaction.reply('no update');
    const onBack = (i: InteractionData) => setPage(0);

    return {
        content: test,
        embeds: [],
        components: [new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents(page == 0 ?
            [menu.addComponent('update', new ButtonBuilder()
                .setLabel('Update')
                .setStyle(ButtonStyle.Success),
                onUpdate),
            menu.addComponent('noUpdate', new ButtonBuilder()
                .setLabel('No Update')
                .setStyle(ButtonStyle.Danger),
                onNoUpdate)]
            :
            [menu.addComponent('back', new ButtonBuilder()
                .setLabel('Back')
                .setStyle(ButtonStyle.Secondary),
                onBack)]
        )]
    }
},
    async (i: InteractionData, id: componentId) => {
        return id.componentId;
    }
)
