import { ComponentOptions, DefineComponent } from 'vue';
export declare type StrokeLinejoin = 'miter' | 'round' | 'bevel';
export declare type StrokeLinecap = 'butt' | 'round' | 'square';
export declare type Theme = 'outline' | 'filled' | 'two-tone' | 'multi-color';
export interface ISvgIconProps {
    id: string;
    size: number | string;
    strokeWidth: number;
    strokeLinecap: StrokeLinecap;
    strokeLinejoin: StrokeLinejoin;
    colors: string[];
}
export interface IIconConfig {
    size: number | string;
    strokeWidth: number;
    strokeLinecap: StrokeLinecap;
    strokeLinejoin: StrokeLinejoin;
    prefix: string;
    rtl: boolean;
    theme: Theme;
    colors: {
        outline: {
            fill: string;
            background: string;
        };
        filled: {
            fill: string;
            background: string;
        };
        twoTone: {
            fill: string;
            twoTone: string;
        };
        multiColor: {
            outStrokeColor: string;
            outFillColor: string;
            innerStrokeColor: string;
            innerFillColor: string;
        };
    };
}
export interface IIconBase {
    size?: number | string;
    strokeWidth?: number;
    strokeLinecap?: StrokeLinecap;
    strokeLinejoin?: StrokeLinejoin;
    theme?: Theme;
    fill?: string | string[];
}
export interface IIconProps extends IIconBase {
    spin?: boolean;
}
export declare type IconOptions = ComponentOptions<IIconProps>;
export declare type IconRender = (props: ISvgIconProps) => JSX.Element;
export declare type Icon = DefineComponent<IIconProps>;
export declare const DEFAULT_ICON_CONFIGS: IIconConfig;
export declare function IconConverter(id: string, icon: IIconBase, config: IIconConfig): ISvgIconProps;
export declare const IconProvider: (config: IIconConfig) => void;
export declare function IconWrapper(name: string, rtl: boolean, render: IconRender): Icon;
