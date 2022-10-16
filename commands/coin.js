const { SlashCommandBuilder } = require('@discordjs/builders');

const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

let flipButton = new MessageButton()
    .setCustomId("flip")
    .setLabel("Flip")
    .setStyle("PRIMARY")

let coin = ["Heads", "Tails"]

let spinning = "https://i.imgur.com/L1F3Dx2.gif"

let coinSide = {
    "Heads": "https://i.imgur.com/VFdn2MM.png",
    "Tails": "https://i.imgur.com/thHv3dP.png"
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('coin')
        .setDescription('Shows flippable coin.'),
    async execute(interaction) {
        // await interaction.reply('Pong!');
        const row = new MessageActionRow()
            .addComponents(
                [flipButton
                ])

        await interaction.reply({ embeds: [new MessageEmbed().setDescription("Heads or Tails").setImage(spinning)], components: [row] })


        const filter = i => i.customId === 'flip';

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });

        let log = "";

        collector.on('collect', async i => {
            if (i.customId === 'flip') {

                let rand = coin[Math.floor(Math.random() * coin.length)]
                // log+=rand + " "
                log = rand + " " + log
                console.log("Flip: " + rand)
                // await i.update({ content: rand, embeds: [], components: [] });
                await i.update({ embeds: [new MessageEmbed().setTitle("**" + rand + "**").setImage(coinSide[rand]).setDescription(log)], components: [row] })

            }
        });

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} items`)
            interaction.deleteReply();
        });
    },
};

