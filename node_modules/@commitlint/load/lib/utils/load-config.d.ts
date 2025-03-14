export interface LoadConfigResult {
    config: unknown;
    filepath: string;
    isEmpty?: boolean;
}
export declare function loadConfig(cwd: string, configPath?: string): Promise<LoadConfigResult | null>;
export declare const isDynamicAwaitSupported: () => boolean;
export declare const isEsmModule: (cwd: string) => boolean;
//# sourceMappingURL=load-config.d.ts.map