import { ButtonBuilder } from "@discordjs/builders";
import { BaseInteraction, ButtonInteraction, ComponentBuilder, ModalBuilder, ModalSubmitInteraction, SelectMenuBuilder, SelectMenuInteraction } from "discord.js";
import { CallbackFunction, ComponentParam, ComponentTypes, BaseType } from "../types/Component";

export abstract class Component<K extends BaseType, I extends BaseInteraction>{
    abstract type: ComponentTypes;
    name: string = '';
    renderFunction: ComponentParam<K>
    callback: CallbackFunction<I> = () => console.log('callback not implemented');

    constructor(builder: ComponentParam<K>){
        this.renderFunction = builder;
    }

    setCallback(c: CallbackFunction<I>) : Component<K, I> {
        this.callback = c;
        return this;
    }

    setName(name: string) : Component<K, I>{
        this.name = name;
        return this;
    }

    async render(data: string[], ...renderProps: any[]): Promise<K>{
        const builder: K = await this.renderFunction.apply(null, renderProps);
        let customID = this.name;
        data.forEach(i => customID+=`#${i}`);
        builder.setCustomId(customID);
        return builder;
    }
}

export class Button extends Component<ButtonBuilder, ButtonInteraction> { type = ComponentTypes.button }
export class Menu extends Component<SelectMenuBuilder, SelectMenuInteraction>{ type = ComponentTypes.menu }
export class Modal extends Component<ModalBuilder, ModalSubmitInteraction> { type = ComponentTypes.modal }