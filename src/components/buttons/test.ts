import { ButtonBuilder } from "@discordjs/builders";
import { ActionRowBuilder, ButtonStyle, GuildMember, MessageActionRowComponentBuilder } from "discord.js";
import { Button } from "../../structs/Component";


export default new Button(() => 
    new ButtonBuilder()
    .setLabel(`X`)
    .setStyle(ButtonStyle.Danger)
).setCallback(async ({interaction}) => {
    await interaction.reply({content: 'rebuilding button', ephemeral: true})
}).setName('cancel_button');