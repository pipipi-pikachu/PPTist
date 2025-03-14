import { App, DefineComponent, ComponentOptions } from 'vue';
import * as IconMap from './map';
import { IIconProps } from './runtime';
export declare type IconType = keyof typeof IconMap;
export interface IIconAllProps extends IIconProps {
    type: IconType | string;
}
export declare type IIconAllOptions = ComponentOptions<IIconAllProps>;
export declare type AllIcon = DefineComponent<IIconAllProps>;
export declare const IconPark: AllIcon;
export declare function install(Vue: App, prefix?: string): void;
