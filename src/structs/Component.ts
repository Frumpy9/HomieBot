import { AnyComponentBuilder } from "@discordjs/builders";
import { ButtonBuilder } from "@discordjs/builders";
import { BaseInteraction, ButtonInteraction, ComponentBuilder, RESTOAuth2AdvancedBotAuthorizationQueryResult } from "discord.js";
import { CallbackParams, CallbackFunction, ComponentParam, RenderArgs } from "../types/Component";

export abstract class Component<K extends ComponentBuilder, I extends BaseInteraction>{
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

    abstract render(data: string[], ...renderProps: any[]): K;
}

export class Button extends Component<ButtonBuilder, ButtonInteraction>{
    render(data: string[], ...renderProps: any[]): ButtonBuilder{
        
        const builder: ButtonBuilder = this.renderFunction.apply(null, renderProps);
        builder.setCustomId(this.name + data.map(p => p = '#'+p).join())
        return builder;
    }
}