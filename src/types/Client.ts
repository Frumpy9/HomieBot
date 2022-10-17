import { ApplicationCommandDataResolvable } from "discord.js";

export interface registerCommandsParams {
    guildId?: string;
    commands: ApplicationCommandDataResolvable[];
}