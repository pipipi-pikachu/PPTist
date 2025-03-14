"use strict";
/// <reference types="@volar/typescript" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRootFileChecker = createRootFileChecker;
exports.createVueLanguagePlugin = createVueLanguagePlugin;
exports.createVueLanguagePlugin2 = createVueLanguagePlugin2;
exports.getAllExtensions = getAllExtensions;
const language_core_1 = require("@volar/language-core");
const CompilerDOM = require("@vue/compiler-dom");
const plugins_1 = require("./plugins");
const CompilerVue2 = require("./utils/vue2TemplateCompiler");
const vueFile_1 = require("./virtualFile/vueFile");
const normalFileRegistries = [];
const holderFileRegistries = [];
function getVueFileRegistry(isGlobalTypesHolder, key, plugins) {
    const fileRegistries = isGlobalTypesHolder ? holderFileRegistries : normalFileRegistries;
    let fileRegistry = fileRegistries.find(r => r.key === key
        && r.plugins.length === plugins.length
        && r.plugins.every(plugin => plugins.includes(plugin)))?.files;
    if (!fileRegistry) {
        fileRegistry = new Map();
        fileRegistries.push({
            key: key,
            plugins: plugins,
            files: fileRegistry,
        });
    }
    return fileRegistry;
}
function getFileRegistryKey(compilerOptions, vueCompilerOptions, plugins) {
    const values = [
        ...Object.keys(vueCompilerOptions)
            .sort()
            .filter(key => key !== 'plugins')
            .map(key => [key, vueCompilerOptions[key]]),
        [...new Set(plugins.map(plugin => plugin.requiredCompilerOptions ?? []).flat())]
            .sort()
            .map(key => [key, compilerOptions[key]]),
    ];
    return JSON.stringify(values);
}
function createRootFileChecker(getProjectVersion, getRootFileNames, caseSensitive) {
    const fileNames = new language_core_1.FileMap(caseSensitive);
    let projectVersion;
    return (fileName) => {
        if (!getProjectVersion || projectVersion !== getProjectVersion()) {
            projectVersion = getProjectVersion?.();
            fileNames.clear();
            for (const rootFileName of getRootFileNames()) {
                fileNames.set(rootFileName, undefined);
            }
        }
        return fileNames.has(fileName);
    };
}
// TODO: replace `createVueLanguagePlugin` with `createVueLanguagePlugin2` in 2.1
function createVueLanguagePlugin(ts, asFileName, _getProjectVersion, isRootFile, compilerOptions, vueCompilerOptions) {
    return createVueLanguagePlugin2(ts, asFileName, isRootFile, compilerOptions, vueCompilerOptions);
}
function createVueLanguagePlugin2(ts, asFileName, isRootFile, compilerOptions, vueCompilerOptions) {
    const pluginContext = {
        modules: {
            '@vue/compiler-dom': vueCompilerOptions.target < 3
                ? {
                    ...CompilerDOM,
                    compile: CompilerVue2.compile,
                }
                : CompilerDOM,
            typescript: ts,
        },
        compilerOptions,
        vueCompilerOptions,
        globalTypesHolder: undefined,
    };
    const plugins = (0, plugins_1.createPlugins)(pluginContext);
    return {
        getLanguageId(scriptId) {
            const fileName = asFileName(scriptId);
            for (const plugin of plugins) {
                const languageId = plugin.getLanguageId?.(fileName);
                if (languageId) {
                    return languageId;
                }
            }
        },
        createVirtualCode(scriptId, languageId, snapshot) {
            const fileName = asFileName(scriptId);
            if (plugins.some(plugin => plugin.isValidFile?.(fileName, languageId))) {
                if (!pluginContext.globalTypesHolder && isRootFile(fileName)) {
                    pluginContext.globalTypesHolder = fileName;
                }
                const fileRegistry = getFileRegistry(pluginContext.globalTypesHolder === fileName);
                const code = fileRegistry.get(fileName);
                if (code) {
                    code.update(snapshot);
                    return code;
                }
                else {
                    const code = new vueFile_1.VueVirtualCode(fileName, languageId, snapshot, vueCompilerOptions, plugins, ts);
                    fileRegistry.set(fileName, code);
                    return code;
                }
            }
        },
        updateVirtualCode(_fileId, code, snapshot) {
            code.update(snapshot);
            return code;
        },
        // TODO: when global types holder deleted, move global types to another file
        // disposeVirtualCode(fileId, code) {
        // 	const isGlobalTypesHolder = code.fileName === pluginContext.globalTypesHolder;
        // 	const fileRegistry = getFileRegistry(isGlobalTypesHolder);
        // 	fileRegistry.delete(fileId);
        // 	if (isGlobalTypesHolder) {
        // 		pluginContext.globalTypesHolder = undefined;
        // 		const fileRegistry2 = getFileRegistry(false);
        // 		for (const [fileId, code] of fileRegistry2) {
        // 			if (isValidGlobalTypesHolder(code.fileName)) {
        // 				pluginContext.globalTypesHolder = code.fileName;
        // 				fileRegistry2.delete(fileId);
        // 				// force dirty
        // 				files?.delete(fileId);
        // 				files?.set(
        // 					fileId,
        // 					code.languageId,
        // 					code.snapshot,
        // 				);
        // 				break;
        // 			}
        // 		}
        // 	}
        // },
        typescript: {
            extraFileExtensions: getAllExtensions(vueCompilerOptions)
                .map(ext => ({
                extension: ext.slice(1),
                isMixedContent: true,
                scriptKind: 7,
            })),
            getServiceScript(root) {
                for (const code of (0, language_core_1.forEachEmbeddedCode)(root)) {
                    if (/script_(js|jsx|ts|tsx)/.test(code.id)) {
                        const lang = code.id.substring('script_'.length);
                        return {
                            code,
                            extension: '.' + lang,
                            scriptKind: lang === 'js' ? ts.ScriptKind.JS
                                : lang === 'jsx' ? ts.ScriptKind.JSX
                                    : lang === 'tsx' ? ts.ScriptKind.TSX
                                        : ts.ScriptKind.TS,
                        };
                    }
                }
            },
        },
    };
    function getFileRegistry(isGlobalTypesHolder) {
        return getVueFileRegistry(isGlobalTypesHolder, getFileRegistryKey(compilerOptions, vueCompilerOptions, plugins), vueCompilerOptions.plugins);
    }
}
function getAllExtensions(options) {
    const result = new Set();
    for (const key in options) {
        if (key === 'extensions' || key.endsWith('Extensions')) {
            const value = options[key];
            if (Array.isArray(value) && value.every(v => typeof v === 'string')) {
                for (const ext of value) {
                    result.add(ext);
                }
            }
        }
    }
    return [...result];
}
//# sourceMappingURL=languagePlugin.js.map