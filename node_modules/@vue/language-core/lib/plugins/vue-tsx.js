"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsCodegen = void 0;
const computeds_1 = require("computeds");
const path = require("path-browserify");
const script_1 = require("../codegen/script");
const template_1 = require("../codegen/template");
const scriptRanges_1 = require("../parsers/scriptRanges");
const scriptSetupRanges_1 = require("../parsers/scriptSetupRanges");
exports.tsCodegen = new WeakMap();
const plugin = ctx => {
    return {
        version: 2.1,
        requiredCompilerOptions: [
            'noPropertyAccessFromIndexSignature',
            'exactOptionalPropertyTypes',
        ],
        getEmbeddedCodes(fileName, sfc) {
            const tsx = useTsx(fileName, sfc);
            const files = [];
            if (['js', 'ts', 'jsx', 'tsx'].includes(tsx.lang())) {
                files.push({ id: 'script_' + tsx.lang(), lang: tsx.lang() });
            }
            return files;
        },
        resolveEmbeddedCode(fileName, sfc, embeddedFile) {
            const _tsx = useTsx(fileName, sfc);
            if (/script_(js|jsx|ts|tsx)/.test(embeddedFile.id)) {
                const tsx = _tsx.generatedScript();
                if (tsx) {
                    const content = [...tsx.codes];
                    embeddedFile.content = content;
                    embeddedFile.linkedCodeMappings = [...tsx.linkedCodeMappings];
                }
            }
        },
    };
    function useTsx(fileName, sfc) {
        if (!exports.tsCodegen.has(sfc)) {
            exports.tsCodegen.set(sfc, createTsx(fileName, sfc, ctx));
        }
        return exports.tsCodegen.get(sfc);
    }
};
exports.default = plugin;
function createTsx(fileName, _sfc, ctx) {
    const ts = ctx.modules.typescript;
    const lang = (0, computeds_1.computed)(() => {
        return !_sfc.script && !_sfc.scriptSetup ? 'ts'
            : _sfc.scriptSetup && _sfc.scriptSetup.lang !== 'js' ? _sfc.scriptSetup.lang
                : _sfc.script && _sfc.script.lang !== 'js' ? _sfc.script.lang
                    : 'js';
    });
    const scriptRanges = (0, computeds_1.computed)(() => _sfc.script
        ? (0, scriptRanges_1.parseScriptRanges)(ts, _sfc.script.ast, !!_sfc.scriptSetup, false)
        : undefined);
    const scriptSetupRanges = (0, computeds_1.computed)(() => _sfc.scriptSetup
        ? (0, scriptSetupRanges_1.parseScriptSetupRanges)(ts, _sfc.scriptSetup.ast, ctx.vueCompilerOptions)
        : undefined);
    const generatedTemplate = (0, computeds_1.computed)(() => {
        if (!_sfc.template) {
            return;
        }
        const codes = [];
        const codegen = (0, template_1.generateTemplate)({
            ts,
            compilerOptions: ctx.compilerOptions,
            vueCompilerOptions: ctx.vueCompilerOptions,
            template: _sfc.template,
            scriptSetupBindingNames: scriptSetupBindingNames(),
            scriptSetupImportComponentNames: scriptSetupImportComponentNames(),
            hasDefineSlots: hasDefineSlots(),
            slotsAssignName: slotsAssignName(),
            propsAssignName: propsAssignName(),
        });
        let current = codegen.next();
        while (!current.done) {
            const code = current.value;
            codes.push(code);
            current = codegen.next();
        }
        return {
            ...current.value,
            codes: codes,
        };
    });
    const hasDefineSlots = (0, computeds_1.computed)(() => !!scriptSetupRanges()?.slots.define);
    const scriptSetupBindingNames = (0, computeds_1.computed)(oldNames => {
        const newNames = new Set();
        const bindings = scriptSetupRanges()?.bindings;
        if (_sfc.scriptSetup && bindings) {
            for (const binding of bindings) {
                newNames.add(_sfc.scriptSetup?.content.substring(binding.start, binding.end));
            }
        }
        if (newNames && oldNames && twoSetsEqual(newNames, oldNames)) {
            return oldNames;
        }
        return newNames;
    });
    const scriptSetupImportComponentNames = (0, computeds_1.computed)(oldNames => {
        const newNames = scriptSetupRanges()?.importComponentNames ?? new Set();
        if (newNames && oldNames && twoSetsEqual(newNames, oldNames)) {
            return oldNames;
        }
        return newNames;
    });
    const slotsAssignName = (0, computeds_1.computed)(() => scriptSetupRanges()?.slots.name);
    const propsAssignName = (0, computeds_1.computed)(() => scriptSetupRanges()?.props.name);
    const generatedScript = (0, computeds_1.computed)(() => {
        const codes = [];
        const linkedCodeMappings = [];
        const _template = generatedTemplate();
        let generatedLength = 0;
        for (const code of (0, script_1.generateScript)({
            ts,
            fileBaseName: path.basename(fileName),
            globalTypes: ctx.globalTypesHolder === fileName,
            sfc: _sfc,
            lang: lang(),
            scriptRanges: scriptRanges(),
            scriptSetupRanges: scriptSetupRanges(),
            templateCodegen: _template,
            compilerOptions: ctx.compilerOptions,
            vueCompilerOptions: ctx.vueCompilerOptions,
            getGeneratedLength: () => generatedLength,
            linkedCodeMappings,
        })) {
            codes.push(code);
            generatedLength += typeof code === 'string'
                ? code.length
                : code[0].length;
        }
        ;
        return {
            codes,
            linkedCodeMappings,
        };
    });
    return {
        scriptRanges,
        scriptSetupRanges,
        lang,
        generatedScript,
        generatedTemplate,
    };
}
function twoSetsEqual(a, b) {
    if (a.size !== b.size) {
        return false;
    }
    for (const file of a) {
        if (!b.has(file)) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=vue-tsx.js.map