import { EmbedBuilder } from "discord.js";
import { Command } from "../../structs/Command";

export default new Command()
    .setName('eval')
    .setDescription('eval(message)')
    .addStringOption((option) => option.setName("code").setDescription("code to execute").setRequired(true))
    .setExecute(async ({ interaction, options }) => {
        //TODO: permissions
        if(interaction.user.id !== "286207102417108993" && interaction.user.id !== "134088598684303360") return interaction.reply("no")

        let guild = interaction.guild;
        let bot = interaction.client;
        let channel = interaction.channel;

        let input = options.getString("code")
        if (!input) return;

        const clean = (text: any) => {
            if (typeof (text) === "string")
                return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
        }

        try {

            let evaled = eval(input);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);



                const evalEmbed = new EmbedBuilder()
                    .addFields(
                        { name: '**Input:**', value: '```+js\n'+input+'```', inline: false },
                        { name: '**Output:**', value: '```\n'+evaled+'```', inline: false }
                    )
                interaction.reply({ embeds: [evalEmbed] })
        }
        catch (err: any) {
            if (err.toString().includes("TypeError [ERR_INVALID_CALLBACK]")) return;
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle("**Error**")
                .addFields(
                    { name: '**Input:**', value: `\`\`\`js\n${input}\`\`\``, inline: false },
                    { name: '**Error:**', value: `\`\`\`\n${(err)}\`\`\``, inline: false }
                )
            interaction.reply({ embeds: [errorEmbed] });
        }
    });