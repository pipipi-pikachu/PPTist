"use strict";
/// <reference types="@volar/typescript" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVueLanguagePlugin = createVueLanguagePlugin;
const language_core_1 = require("@volar/language-core");
const CompilerDOM = require("@vue/compiler-dom");
const plugins_1 = require("./plugins");
const file_html_1 = require("./plugins/file-html");
const file_md_1 = require("./plugins/file-md");
const file_vue_1 = require("./plugins/file-vue");
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
function createVueLanguagePlugin(ts, asFileName, getProjectVersion, isRootFile, compilerOptions, vueCompilerOptions) {
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
    const basePlugins = (0, plugins_1.getBasePlugins)(pluginContext);
    const vueSfcPlugin = (0, file_vue_1.default)(pluginContext);
    const vitePressSfcPlugin = (0, file_md_1.default)(pluginContext);
    const petiteVueSfcPlugin = (0, file_html_1.default)(pluginContext);
    let canonicalRootFileNamesVersion;
    return {
        getLanguageId(scriptId) {
            if (vueCompilerOptions.extensions.some(ext => asFileName(scriptId).endsWith(ext))) {
                return 'vue';
            }
            if (vueCompilerOptions.vitePressExtensions.some(ext => asFileName(scriptId).endsWith(ext))) {
                return 'markdown';
            }
            if (vueCompilerOptions.petiteVueExtensions.some(ext => asFileName(scriptId).endsWith(ext))) {
                return 'html';
            }
        },
        createVirtualCode(scriptId, languageId, snapshot) {
            if (languageId === 'vue' || languageId === 'markdown' || languageId === 'html') {
                const fileName = asFileName(scriptId);
                if (getProjectVersion() !== canonicalRootFileNamesVersion) {
                    canonicalRootFileNamesVersion = getProjectVersion();
                }
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
                    const code = new vueFile_1.VueVirtualCode(fileName, languageId, snapshot, vueCompilerOptions, languageId === 'html'
                        ? [petiteVueSfcPlugin, ...basePlugins]
                        : languageId === 'markdown'
                            ? [vitePressSfcPlugin, ...basePlugins]
                            : [vueSfcPlugin, ...basePlugins], ts);
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
            extraFileExtensions: [
                ...vueCompilerOptions.extensions,
                ...vueCompilerOptions.vitePressExtensions,
                ...vueCompilerOptions.petiteVueExtensions,
            ].map(ext => ({
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
        return getVueFileRegistry(isGlobalTypesHolder, getFileRegistryKey(compilerOptions, vueCompilerOptions, basePlugins), vueCompilerOptions.plugins);
    }
}
//# sourceMappingURL=languageModule.js.map