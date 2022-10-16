const { SlashCommandBuilder } = require("@discordjs/builders");
const { Configuration, OpenAIApi } = require("openai");
const config = require("../config.json");

const configuration = new Configuration({
	apiKey: config.openaiKey
});

const openai = new OpenAIApi(configuration);

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ask")
		.setDescription("Answers questions")
		.addStringOption((option) => option.setName("question").setDescription("The question you want answered.").setRequired(true))
		.addBooleanOption((option) => option.setName("long").setDescription("If the answer will be long")),
	async execute(interaction) {
		if (!interaction.member.roles.cache.has("522215220760805377")) return await interaction.reply({ content: "Homies only!", ephemeral: true });

		await interaction.deferReply();
		const question = interaction.options.getString("question");
		const long = interaction.options.getBoolean("long");

		const response = await openai.createCompletion({
			model: "text-davinci-002",
			prompt: "Answer the following question or statement:\n" + addQM(question),
			temperature: 0.7,
			max_tokens: long ? 250 : 50,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0
		});

		const resText = response.data.choices[0].text;

		const embed = {
			color: 2022395,
			timestamp: Date.now(),
			author: {
				name: "Massive brain AI",
				url: "https://en.wikipedia.org/wiki/GPT-3",
				icon_url: "https://i.imgur.com/HyxmKNZ.png"
			},
			fields: [
				{
					name: "You asked:",
					value: addQM(question)
				},
				{
					name: "Answer:",
					value: resText
				}
			]
		};

		await interaction.editReply({ embeds: [embed] });
	}
};

function addQM(q) {
	if (!q.includes("?")) {
		return q + "?\n";
	} else {
		return q + "\n";
	}
}
