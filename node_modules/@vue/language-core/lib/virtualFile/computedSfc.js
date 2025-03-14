"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computedSfc = computedSfc;
const computeds_1 = require("computeds");
const parseCssClassNames_1 = require("../utils/parseCssClassNames");
const parseCssVars_1 = require("../utils/parseCssVars");
function computedSfc(ts, plugins, fileName, snapshot, parsed) {
    const untrackedSnapshot = () => {
        (0, computeds_1.pauseTracking)();
        const res = snapshot();
        (0, computeds_1.resetTracking)();
        return res;
    };
    const template = computedNullableSfcBlock('template', 'html', (0, computeds_1.computed)(() => parsed()?.descriptor.template ?? undefined), (_block, base) => {
        const compiledAst = computedTemplateAst(base);
        return mergeObject(base, {
            get ast() { return compiledAst()?.ast; },
            get errors() { return compiledAst()?.errors; },
            get warnings() { return compiledAst()?.warnings; },
        });
    });
    const script = computedNullableSfcBlock('script', 'js', (0, computeds_1.computed)(() => parsed()?.descriptor.script ?? undefined), (block, base) => {
        const src = (0, computeds_1.computed)(() => block().src);
        const srcOffset = (0, computeds_1.computed)(() => {
            const _src = src();
            return _src ? untrackedSnapshot().getText(0, base.startTagEnd).lastIndexOf(_src) - base.startTagEnd : -1;
        });
        const ast = (0, computeds_1.computed)(() => {
            for (const plugin of plugins) {
                const ast = plugin.compileSFCScript?.(base.lang, base.content);
                if (ast) {
                    return ast;
                }
            }
            return ts.createSourceFile(fileName + '.' + base.lang, '', 99);
        });
        return mergeObject(base, {
            get src() { return src(); },
            get srcOffset() { return srcOffset(); },
            get ast() { return ast(); },
        });
    });
    const scriptSetupOriginal = computedNullableSfcBlock('scriptSetup', 'js', (0, computeds_1.computed)(() => parsed()?.descriptor.scriptSetup ?? undefined), (block, base) => {
        const generic = (0, computeds_1.computed)(() => {
            const _block = block();
            return typeof _block.attrs.generic === 'string' ? _block.attrs.generic : undefined;
        });
        const genericOffset = (0, computeds_1.computed)(() => {
            const _generic = generic();
            return _generic !== undefined ? untrackedSnapshot().getText(0, base.startTagEnd).lastIndexOf(_generic) - base.startTagEnd : -1;
        });
        const ast = (0, computeds_1.computed)(() => {
            for (const plugin of plugins) {
                const ast = plugin.compileSFCScript?.(base.lang, base.content);
                if (ast) {
                    return ast;
                }
            }
            return ts.createSourceFile(fileName + '.' + base.lang, '', 99);
        });
        return mergeObject(base, {
            get generic() { return generic(); },
            get genericOffset() { return genericOffset(); },
            get ast() { return ast(); },
        });
    });
    const hasScript = (0, computeds_1.computed)(() => !!parsed()?.descriptor.script);
    const hasScriptSetup = (0, computeds_1.computed)(() => !!parsed()?.descriptor.scriptSetup);
    const scriptSetup = (0, computeds_1.computed)(() => {
        if (!hasScript() && !hasScriptSetup()) {
            //#region monkey fix: https://github.com/vuejs/language-tools/pull/2113
            return {
                content: '',
                lang: 'ts',
                name: '',
                start: 0,
                end: 0,
                startTagEnd: 0,
                endTagStart: 0,
                generic: undefined,
                genericOffset: 0,
                attrs: {},
                ast: ts.createSourceFile('', '', 99, false, ts.ScriptKind.TS),
            };
        }
        return scriptSetupOriginal();
    });
    const styles = (0, computeds_1.computedArray)((0, computeds_1.computed)(() => parsed()?.descriptor.styles ?? []), (block, i) => {
        const base = computedSfcBlock('style_' + i, 'css', block);
        const module = (0, computeds_1.computed)(() => typeof block().module === 'string' ? block().module : block().module ? '$style' : undefined);
        const scoped = (0, computeds_1.computed)(() => !!block().scoped);
        const cssVars = (0, computeds_1.computed)(() => [...(0, parseCssVars_1.parseCssVars)(base.content)]);
        const classNames = (0, computeds_1.computed)(() => [...(0, parseCssClassNames_1.parseCssClassNames)(base.content)]);
        return (0, computeds_1.computed)(() => mergeObject(base, {
            get module() { return module(); },
            get scoped() { return scoped(); },
            get cssVars() { return cssVars(); },
            get classNames() { return classNames(); },
        }));
    });
    const customBlocks = (0, computeds_1.computedArray)((0, computeds_1.computed)(() => parsed()?.descriptor.customBlocks ?? []), (block, i) => {
        const base = computedSfcBlock('custom_block_' + i, 'txt', block);
        const type = (0, computeds_1.computed)(() => block().type);
        return (0, computeds_1.computed)(() => mergeObject(base, {
            get type() { return type(); },
        }));
    });
    return {
        get template() { return template(); },
        get script() { return script(); },
        get scriptSetup() { return scriptSetup(); },
        get styles() { return styles; },
        get customBlocks() { return customBlocks; },
    };
    function computedTemplateAst(base) {
        let cache;
        return (0, computeds_1.computed)(() => {
            if (cache?.template === base.content) {
                return {
                    errors: [],
                    warnings: [],
                    ast: cache?.result.ast,
                };
            }
            // incremental update
            if (cache?.plugin.updateSFCTemplate) {
                const change = untrackedSnapshot().getChangeRange(cache.snapshot);
                if (change) {
                    (0, computeds_1.pauseTracking)();
                    const templateOffset = base.startTagEnd;
                    (0, computeds_1.resetTracking)();
                    const newText = untrackedSnapshot().getText(change.span.start, change.span.start + change.newLength);
                    const newResult = cache.plugin.updateSFCTemplate(cache.result, {
                        start: change.span.start - templateOffset,
                        end: change.span.start + change.span.length - templateOffset,
                        newText,
                    });
                    if (newResult) {
                        cache.template = base.content;
                        cache.snapshot = untrackedSnapshot();
                        cache.result = newResult;
                        return {
                            errors: [],
                            warnings: [],
                            ast: newResult.ast,
                        };
                    }
                }
            }
            const errors = [];
            const warnings = [];
            let options = {
                onError: (err) => errors.push(err),
                onWarn: (err) => warnings.push(err),
                expressionPlugins: ['typescript'],
            };
            for (const plugin of plugins) {
                if (plugin.resolveTemplateCompilerOptions) {
                    options = plugin.resolveTemplateCompilerOptions(options);
                }
            }
            for (const plugin of plugins) {
                let result;
                try {
                    result = plugin.compileSFCTemplate?.(base.lang, base.content, options);
                }
                catch (e) {
                    const err = e;
                    errors.push(err);
                }
                if (result || errors.length) {
                    if (result && !errors.length && !warnings.length) {
                        cache = {
                            template: base.content,
                            snapshot: untrackedSnapshot(),
                            result: result,
                            plugin,
                        };
                    }
                    else {
                        cache = undefined;
                    }
                    return {
                        errors,
                        warnings,
                        ast: result?.ast,
                    };
                }
            }
            return {
                errors,
                warnings,
                ast: undefined,
            };
        });
    }
    function computedNullableSfcBlock(name, defaultLang, block, resolve) {
        const hasBlock = (0, computeds_1.computed)(() => !!block());
        return (0, computeds_1.computed)(() => {
            if (!hasBlock()) {
                return;
            }
            const _block = (0, computeds_1.computed)(() => block());
            return resolve(_block, computedSfcBlock(name, defaultLang, _block));
        });
    }
    function computedSfcBlock(name, defaultLang, block) {
        const lang = (0, computeds_1.computed)(() => block().lang ?? defaultLang);
        const attrs = (0, computeds_1.computed)(() => block().attrs); // TODO: computed it
        const content = (0, computeds_1.computed)(() => block().content);
        const startTagEnd = (0, computeds_1.computed)(() => block().loc.start.offset);
        const endTagStart = (0, computeds_1.computed)(() => block().loc.end.offset);
        const start = (0, computeds_1.computed)(() => untrackedSnapshot().getText(0, startTagEnd()).lastIndexOf('<' + block().type));
        const end = (0, computeds_1.computed)(() => endTagStart() + untrackedSnapshot().getText(endTagStart(), untrackedSnapshot().getLength()).indexOf('>') + 1);
        return {
            name,
            get lang() { return lang(); },
            get attrs() { return attrs(); },
            get content() { return content(); },
            get startTagEnd() { return startTagEnd(); },
            get endTagStart() { return endTagStart(); },
            get start() { return start(); },
            get end() { return end(); },
        };
    }
}
function mergeObject(a, b) {
    return Object.defineProperties(a, Object.getOwnPropertyDescriptors(b));
}
//# sourceMappingURL=computedSfc.js.map