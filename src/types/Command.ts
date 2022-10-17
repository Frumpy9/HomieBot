import { ChatInputApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver, GuildMember, SlashCommandBuilder } from "discord.js";
import { ExtendedClient } from "../structs/Client";

export interface ExtendedInteraction extends CommandInteraction {
    member: GuildMember;
}

interface ExecuteParams {
    client: ExtendedClient;
    interaction: ExtendedInteraction;
    options: CommandInteractionOptionResolver;
}

export type ExecuteFunction = (args: ExecuteParams) => any;

export interface ICommand extends SlashCommandBuilder {
    execute: ExecuteFunction;
}