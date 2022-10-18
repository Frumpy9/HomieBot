import { BaseInteraction, ComponentBuilder } from "discord.js";
import { ExtendedClient } from "../structs/Client";

export type ComponentParam<I extends ComponentBuilder> = (...args: any) => I;

export interface CallbackParams<I extends BaseInteraction> {
    interaction: I;
    client: ExtendedClient;
}

export interface RenderArgs{
    data: string[];
    renderProps: any;
}

export interface IComponent{
    name: string;
    callback: CallbackFunction<BaseInteraction>;
}

export type CallbackFunction<I extends BaseInteraction> = (a: CallbackParams<I>, ...args: any) => any