import { ModalBuilder } from "@discordjs/builders";
import { ButtonBuilder, ButtonInteraction, Collection, InteractionType, MessageActionRowComponentBuilder, MessagePayload, ModalSubmitInteraction, SelectMenuBuilder, SelectMenuInteraction } from "discord.js";
import { RawMessagePayloadData } from "discord.js/typings/rawDataTypes";
import { ExtendedClient } from "./Client";

type Interactions = ButtonInteraction | SelectMenuInteraction | ModalSubmitInteraction
type RenderFunction = (menu: MenuInstance,props: any)=>Promise<RawMessagePayloadData> | RawMessagePayloadData;
type RebuildFunction = (interaction: InteractionData, id: componentId)=> any;
type ComponentCallback = (interaction: InteractionData) => void | Promise<any>;

export interface componentId{
    menuId: string,
    instanceId: string,
    componentId: string,
}
export interface InteractionData{
    interaction: Interactions,
    client: ExtendedClient
}

export class Menu {
    render: RenderFunction;
    rebuild: any;
    name: string;
    instances: Collection<string, MenuInstance> = new Collection();

    constructor(name: string, render: RenderFunction, rebuild: RebuildFunction){
        this.render = render;
        this.rebuild = rebuild;
        this.name = name;
        this.instances = new Collection();
    }

    new(id: string, props: any): MenuInstance{
        const instance = new MenuInstance(this.name, id, this.render, props);
        this.instances.set(id, instance);
        return instance;
    }

    async rehydrate(interaction: InteractionData, id: componentId){
        console.log('rehydrating');
        const props = await this.rebuild(interaction, id);
        const instance = new MenuInstance(this.name, id.instanceId, this.render, props);
        this.instances.set(id.instanceId, instance);
        interaction.interaction.reply({content: 'rehydrated!', ephemeral: true});
        if (interaction.interaction.type == InteractionType.ModalSubmit) return;
        const message = await instance.send();
        await interaction.interaction.message.edit(message);
    }

    async handleInteraction(interaction: InteractionData, componentId: componentId){
        const {instanceId} = componentId
        if (!this.instances.has(instanceId)) return await this.rehydrate(interaction, componentId);
        return this.instances.get(instanceId)?.handleInteraction(interaction, componentId);
    }
}

export class MenuInstance{
    private render: RenderFunction;
    private props: any;
    private callbacks: Collection<string, any> = new Collection();
    private state: Array<any> = [];
    private initialized = false;
    private stateIndex = -1;
    private prefix;
    private stateIsDirty = false;

    public constructor(menu: string, id: string, render: RenderFunction, props: any){
        this.props = props;
        this.render = render;
        this.props = props;
        this.prefix = `${menu}#${id}`;
    }

    public async send(){
        const render = await this.render(this, this.props) as MessagePayload;
        this.initialized = true;
        return render;
    }
    

    public useState(initialState: any){
        if (!this.initialized) this.state.push(initialState);
        this.stateIndex += 1;

        //this is awful but I blame this shit language
        const index = JSON.parse(JSON.stringify(this.stateIndex))

        return [
            this.state[this.stateIndex],
            (s: any)=>{
                this.stateIsDirty = true;
                this.state[index] = s
            }
        ]
    }

    public addComponent(id: string, builder: ButtonBuilder | SelectMenuBuilder | ModalBuilder, callback: ComponentCallback){
        this.callbacks.set(id, callback);
        return builder.setCustomId(`${this.prefix}#${id}`) as MessageActionRowComponentBuilder;
    }

    public async reRender(i: InteractionData){
        console.log('re-rendering');
        
        if (this.stateIsDirty){
            this.stateIsDirty = false;
            this.callbacks.clear();
            this.stateIndex = -1;
            const updated = await this.render(this, this.props) as MessagePayload

            if (i.interaction.replied){
                await i.interaction.message?.edit(updated);
            }else {
                if (i.interaction.type == InteractionType.ModalSubmit) return;
                i.interaction.update(updated);
            }
        }
    }

    public async handleInteraction(i: InteractionData, id: componentId){
        const component = id.componentId;
        const callback = this.callbacks.get(component);
        const value = callback(i);
        if (!!value && typeof value.then === 'function') {
            (value as Promise<any>).finally(()=>{this.reRender(i)});
        }

        await this.reRender(i);
    }
}