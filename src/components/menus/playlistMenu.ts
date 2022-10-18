import { SelectMenuBuilder } from "@discordjs/builders";
import { spotify } from "../..";
import { Menu } from "../../structs/Component";

export default new Menu(async (name) => {
    
    return new SelectMenuBuilder()
    .setPlaceholder(`Select a homie playlist for **${name}`)
    .setMaxValues(1)
    .setMinValues(1)
    .addOptions([
        {
            label: `Test 1`,
            description: 'this is the first test',
            value: 'test_1',
        },
        {
            label: `Test 2`,
            description: 'this is the second test',
            value: 'test_2',
        },
        {
            label: `Test 3`,
            description: 'this is the third test',
            value: 'test_3',
        }
    ])
}).setCallback(async ({interaction}, songID) => {
    await interaction.reply({ content: songID, ephemeral: true })
}).setName('playlist_button');