"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
exports.removeEmitGlobalTypes = removeEmitGlobalTypes;
const runTsc_1 = require("@volar/typescript/lib/quickstart/runTsc");
const vue = require("@vue/language-core");
const windowsPathReg = /\\/g;
function run() {
    let runExtensions = ['.vue'];
    const extensionsChangedException = new Error('extensions changed');
    const main = () => (0, runTsc_1.runTsc)(require.resolve('typescript/lib/tsc'), runExtensions, (ts, options) => {
        const { configFilePath } = options.options;
        const vueOptions = typeof configFilePath === 'string'
            ? vue.createParsedCommandLine(ts, ts.sys, configFilePath.replace(windowsPathReg, '/')).vueOptions
            : vue.resolveVueCompilerOptions({});
        const allExtensions = vue.getAllExtensions(vueOptions);
        if (runExtensions.length === allExtensions.length
            && runExtensions.every(ext => allExtensions.includes(ext))) {
            const writeFile = options.host.writeFile.bind(options.host);
            options.host.writeFile = (fileName, contents, ...args) => {
                return writeFile(fileName, removeEmitGlobalTypes(contents), ...args);
            };
            const vueLanguagePlugin = vue.createVueLanguagePlugin2(ts, id => id, vue.createRootFileChecker(undefined, () => options.rootNames.map(rootName => rootName.replace(windowsPathReg, '/')), options.host?.useCaseSensitiveFileNames?.() ?? false), options.options, vueOptions);
            return { languagePlugins: [vueLanguagePlugin] };
        }
        else {
            runExtensions = allExtensions;
            throw extensionsChangedException;
        }
    });
    try {
        main();
    }
    catch (err) {
        if (err === extensionsChangedException) {
            main();
        }
        else {
            throw err;
        }
    }
}
const removeEmitGlobalTypesRegexp = /^[^\n]*__VLS_globalTypesStart[\w\W]*__VLS_globalTypesEnd[^\n]*\n?$/mg;
function removeEmitGlobalTypes(dts) {
    return dts.replace(removeEmitGlobalTypesRegexp, '');
}
//# sourceMappingURL=index.js.map