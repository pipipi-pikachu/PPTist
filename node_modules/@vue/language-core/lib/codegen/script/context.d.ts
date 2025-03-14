import type { ScriptCodegenOptions } from './index';
interface HelperType {
    name: string;
    used?: boolean;
    generated?: boolean;
    code: string;
}
export type ScriptCodegenContext = ReturnType<typeof createScriptCodegenContext>;
export declare function createScriptCodegenContext(options: ScriptCodegenOptions): {
    generatedTemplate: boolean;
    generatedPropsType: boolean;
    scriptSetupGeneratedOffset: number | undefined;
    bypassDefineComponent: boolean;
    bindingNames: Set<string>;
    helperTypes: {
        OmitKeepDiscriminatedUnion: HelperType;
        WithDefaults: HelperType;
        Prettify: HelperType;
        WithTemplateSlots: HelperType;
        PropsChildren: HelperType;
        TypePropsToOption: HelperType;
    };
    generateHelperTypes: () => Generator<string, void, unknown>;
};
export {};
