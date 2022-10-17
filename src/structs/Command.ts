import { SlashCommandBuilder } from "discord.js";
import { ExecuteFunction } from "../types/Command";

export class Command extends SlashCommandBuilder{
    execute: ExecuteFunction = () => console.log('command not implemented');

    constructor(){
        super()
    }

    setExecute(exec: ExecuteFunction) : Command{
        this.execute = exec;
        return this;
    }
}