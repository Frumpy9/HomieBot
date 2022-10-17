export const name = 'interactionCreate'
export const execute = async (interaction) => {
	console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);

	if (interaction.isCommand()) {
		const command = interaction.client.commands.get(interaction.commandName);
		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
		}
	}

	if (interaction.isButton()) {
		const customIdSeperated = interaction.customId.split("#");
		const command = interaction.client.commands.get(customIdSeperated[0]);
		try {
			customIdSeperated.shift();
			command.onButton(interaction, customIdSeperated);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
		}
	}
}
