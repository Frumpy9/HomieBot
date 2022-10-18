import { SelectMenuBuilder } from "@discordjs/builders";
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { spotify } from "../..";
import { Modal } from "../../structs/Component";

export default new Modal(async (name) => {
    const title = new TextInputBuilder()
    .setCustomId('title')
    .setLabel('Title of new playlist')
    .setRequired(true)
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Title')
    
    const description = new TextInputBuilder()
    .setCustomId('description')
    .setLabel('Description of new playlist')
    .setRequired(true)
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder('Description')

    return new ModalBuilder()
    .setTitle(`Add ${name} to new playlist`)
    .addComponents([
        new ActionRowBuilder<TextInputBuilder>().setComponents([title]),
        new ActionRowBuilder<TextInputBuilder>().setComponents([description])
    ])
}).setCallback(async ({interaction}, uri) => {
    await interaction.reply({ content: `You created ${interaction.fields.getTextInputValue('title')}`, ephemeral: true })
}).setName('playlist_modal');