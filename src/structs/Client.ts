import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection } from "discord.js";
import { ICommand } from "../types/Command";
import glob from "glob";
import {promisify} from "util";
import { registerCommandsParams } from "../types/Client";
import { Event } from "./Event";
import { Button } from "./Component";
import { ComponentTypes, IComponent } from "../types/Component";

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
    commands: Collection<string, ICommand> = new Collection();
    buttons: Collection<string, IComponent> = new Collection();
    components: Collection<ComponentTypes, Collection<string, IComponent>> = new Collection();

    constructor(){
        super({ intents: 32767});
    }

    start() {
        this.registerModules();
        this.login(process.env.token);
    }

    async importFile(file: string){
        return (await import(file))?.default;
    }

    async registerCommands({commands, guildId}: registerCommandsParams) {
        if (guildId) {
            this.guilds.cache.get(guildId)?.commands.set(commands);
            console.log(`Registering commands to guild: ${guildId}`);
        } else {
            this.application?.commands.set(commands);
            console.log(`Registering global commands`);
        }
    }

    async registerModules(){
        //commands
        const slashCommands: ApplicationCommandDataResolvable[] = [];
        const commandFiles = await globPromise(`${__dirname}/../commands/*/*{.ts,.js}`);
        console.log({ commandFiles });
        commandFiles.forEach(async file => {
            const command: ICommand = await this.importFile(file);
            if (!command.name) return;

            this.commands.set(command.name, command);
            slashCommands.push(command);
        })

        this.on("ready", () => {
            this.registerCommands({
                commands: slashCommands,
                guildId: process.env.guildId
            });
        });

        //components
        const componentFiles = await globPromise(`${__dirname}/../components/*/*{.ts,.js}`);
        console.log({ componentFiles });
        componentFiles.forEach(async file => {
            const component: IComponent = await this.importFile(file);
            const componentCollection = this.components.get(component.type)
            if (!componentCollection) this.components.set(component.type, new Collection());
            this.components.get(component.type)?.set(component.name, component);
        })
        
        
        //events
        const eventFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`);
        eventFiles.forEach(async file => {
            const event: Event<keyof ClientEvents> = await this.importFile(file);
            this.on(event.event, event.run);
        })
        console.log({ eventFiles });
    }
}