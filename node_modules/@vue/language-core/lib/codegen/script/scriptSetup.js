"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateScriptSetupImports = generateScriptSetupImports;
exports.generateScriptSetup = generateScriptSetup;
const common_1 = require("../common");
const component_1 = require("./component");
const index_1 = require("./index");
const template_1 = require("./template");
function* generateScriptSetupImports(scriptSetup, scriptSetupRanges) {
    yield [
        scriptSetup.content.substring(0, Math.max(scriptSetupRanges.importSectionEndOffset, scriptSetupRanges.leadingCommentEndOffset)),
        'scriptSetup',
        0,
        index_1.codeFeatures.all,
    ];
    yield common_1.newLine;
}
function* generateScriptSetup(options, ctx, scriptSetup, scriptSetupRanges) {
    const definePropMirrors = new Map();
    if (scriptSetup.generic) {
        if (!options.scriptRanges?.exportDefault) {
            if (options.sfc.scriptSetup) {
                // #4569
                yield [
                    '',
                    'scriptSetup',
                    options.sfc.scriptSetup.content.length,
                    index_1.codeFeatures.verification,
                ];
            }
            yield `export default `;
        }
        yield `(<`;
        yield [
            scriptSetup.generic,
            scriptSetup.name,
            scriptSetup.genericOffset,
            index_1.codeFeatures.all,
        ];
        if (!scriptSetup.generic.endsWith(`,`)) {
            yield `,`;
        }
        yield `>(${common_1.newLine}`
            + `	__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>['props'],${common_1.newLine}`
            + `	__VLS_ctx?: ${ctx.helperTypes.Prettify.name}<Pick<NonNullable<Awaited<typeof __VLS_setup>>, 'attrs' | 'emit' | 'slots'>>,${common_1.newLine}` // use __VLS_Prettify for less dts code
            + `	__VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>['expose'],${common_1.newLine}`
            + `	__VLS_setup = (async () => {${common_1.newLine}`;
        yield* generateSetupFunction(options, ctx, scriptSetup, scriptSetupRanges, undefined, definePropMirrors);
        const emitTypes = ['__VLS_ModelEmitsType'];
        if (scriptSetupRanges.emits.define) {
            emitTypes.unshift(`typeof ${scriptSetupRanges.emits.name ?? '__VLS_emit'}`);
        }
        yield `		return {} as {${common_1.newLine}`
            + `			props: ${ctx.helperTypes.Prettify.name}<typeof __VLS_functionalComponentProps & __VLS_PublicProps> & __VLS_BuiltInPublicProps,${common_1.newLine}`
            + `			expose(exposed: import('${options.vueCompilerOptions.lib}').ShallowUnwrapRef<${scriptSetupRanges.expose.define ? 'typeof __VLS_exposed' : '{}'}>): void,${common_1.newLine}`
            + `			attrs: any,${common_1.newLine}`
            + `			slots: ReturnType<typeof __VLS_template>,${common_1.newLine}`
            + `			emit: ${emitTypes.join(' & ')},${common_1.newLine}`
            + `		}${common_1.endOfLine}`;
        yield `	})(),${common_1.newLine}`; // __VLS_setup = (async () => {
        yield `) => ({} as import('${options.vueCompilerOptions.lib}').VNode & { __ctx?: Awaited<typeof __VLS_setup> }))`;
    }
    else if (!options.sfc.script) {
        // no script block, generate script setup code at root
        yield* generateSetupFunction(options, ctx, scriptSetup, scriptSetupRanges, 'export default', definePropMirrors);
    }
    else {
        if (!options.scriptRanges?.exportDefault) {
            yield `export default `;
        }
        yield `await (async () => {${common_1.newLine}`;
        yield* generateSetupFunction(options, ctx, scriptSetup, scriptSetupRanges, 'return', definePropMirrors);
        yield `})()`;
    }
    if (ctx.scriptSetupGeneratedOffset !== undefined) {
        for (const defineProp of scriptSetupRanges.defineProp) {
            if (!defineProp.name) {
                continue;
            }
            const propName = scriptSetup.content.substring(defineProp.name.start, defineProp.name.end);
            const propMirror = definePropMirrors.get(propName);
            if (propMirror !== undefined) {
                options.linkedCodeMappings.push({
                    sourceOffsets: [defineProp.name.start + ctx.scriptSetupGeneratedOffset],
                    generatedOffsets: [propMirror],
                    lengths: [defineProp.name.end - defineProp.name.start],
                    data: undefined,
                });
            }
        }
    }
}
function* generateSetupFunction(options, ctx, scriptSetup, scriptSetupRanges, syntax, definePropMirrors) {
    if (options.vueCompilerOptions.target >= 3.3) {
        yield `const { `;
        for (const macro of Object.keys(options.vueCompilerOptions.macros)) {
            if (!ctx.bindingNames.has(macro)) {
                yield macro + `, `;
            }
        }
        yield `} = await import('${options.vueCompilerOptions.lib}')${common_1.endOfLine}`;
    }
    ctx.scriptSetupGeneratedOffset = options.getGeneratedLength() - scriptSetupRanges.importSectionEndOffset;
    let setupCodeModifies = [];
    const propsRange = scriptSetupRanges.props.withDefaults ?? scriptSetupRanges.props.define;
    if (propsRange && scriptSetupRanges.props.define) {
        const statement = scriptSetupRanges.props.define.statement;
        if (scriptSetupRanges.props.define.typeArg) {
            setupCodeModifies.push([[
                    `let __VLS_typeProps!: `,
                    (0, common_1.generateSfcBlockSection)(scriptSetup, scriptSetupRanges.props.define.typeArg.start, scriptSetupRanges.props.define.typeArg.end, index_1.codeFeatures.all),
                    common_1.endOfLine,
                ], statement.start, statement.start]);
            setupCodeModifies.push([[`typeof __VLS_typeProps`], scriptSetupRanges.props.define.typeArg.start, scriptSetupRanges.props.define.typeArg.end]);
        }
        if (!scriptSetupRanges.props.name) {
            if (statement.start === propsRange.start && statement.end === propsRange.end) {
                setupCodeModifies.push([[`const __VLS_props = `], propsRange.start, propsRange.start]);
            }
            else {
                if (scriptSetupRanges.props.define.typeArg) {
                    setupCodeModifies.push([[
                            `const __VLS_props = `,
                            (0, common_1.generateSfcBlockSection)(scriptSetup, propsRange.start, scriptSetupRanges.props.define.typeArg.start, index_1.codeFeatures.all),
                        ], statement.start, scriptSetupRanges.props.define.typeArg.start]);
                    setupCodeModifies.push([[
                            (0, common_1.generateSfcBlockSection)(scriptSetup, scriptSetupRanges.props.define.typeArg.end, propsRange.end, index_1.codeFeatures.all),
                            `${common_1.endOfLine}`,
                            (0, common_1.generateSfcBlockSection)(scriptSetup, statement.start, propsRange.start, index_1.codeFeatures.all),
                            `__VLS_props`,
                        ], scriptSetupRanges.props.define.typeArg.end, propsRange.end]);
                }
                else {
                    setupCodeModifies.push([[
                            `const __VLS_props = `,
                            (0, common_1.generateSfcBlockSection)(scriptSetup, propsRange.start, propsRange.end, index_1.codeFeatures.all),
                            `${common_1.endOfLine}`,
                            (0, common_1.generateSfcBlockSection)(scriptSetup, statement.start, propsRange.start, index_1.codeFeatures.all),
                            `__VLS_props`,
                        ], statement.start, propsRange.end]);
                }
            }
        }
    }
    if (scriptSetupRanges.slots.define) {
        if (scriptSetupRanges.slots.isObjectBindingPattern) {
            setupCodeModifies.push([
                [`__VLS_slots;\nconst __VLS_slots = `],
                scriptSetupRanges.slots.define.start,
                scriptSetupRanges.slots.define.start,
            ]);
        }
        else if (!scriptSetupRanges.slots.name) {
            setupCodeModifies.push([[`const __VLS_slots = `], scriptSetupRanges.slots.define.start, scriptSetupRanges.slots.define.start]);
        }
    }
    if (scriptSetupRanges.emits.define && !scriptSetupRanges.emits.name) {
        setupCodeModifies.push([[`const __VLS_emit = `], scriptSetupRanges.emits.define.start, scriptSetupRanges.emits.define.start]);
    }
    if (scriptSetupRanges.expose.define) {
        if (scriptSetupRanges.expose.define?.typeArg) {
            setupCodeModifies.push([
                [
                    `let __VLS_exposed!: `,
                    (0, common_1.generateSfcBlockSection)(scriptSetup, scriptSetupRanges.expose.define.typeArg.start, scriptSetupRanges.expose.define.typeArg.end, index_1.codeFeatures.navigation),
                    `${common_1.endOfLine}`,
                ],
                scriptSetupRanges.expose.define.start,
                scriptSetupRanges.expose.define.start,
            ]);
        }
        else if (scriptSetupRanges.expose.define?.arg) {
            setupCodeModifies.push([
                [
                    `const __VLS_exposed = `,
                    (0, common_1.generateSfcBlockSection)(scriptSetup, scriptSetupRanges.expose.define.arg.start, scriptSetupRanges.expose.define.arg.end, index_1.codeFeatures.navigation),
                    `${common_1.endOfLine}`,
                ],
                scriptSetupRanges.expose.define.start,
                scriptSetupRanges.expose.define.start,
            ]);
        }
        else {
            setupCodeModifies.push([
                [`const __VLS_exposed = {}${common_1.endOfLine}`],
                scriptSetupRanges.expose.define.start,
                scriptSetupRanges.expose.define.start,
            ]);
        }
    }
    setupCodeModifies = setupCodeModifies.sort((a, b) => a[1] - b[1]);
    if (setupCodeModifies.length) {
        yield (0, common_1.generateSfcBlockSection)(scriptSetup, scriptSetupRanges.importSectionEndOffset, setupCodeModifies[0][1], index_1.codeFeatures.all);
        while (setupCodeModifies.length) {
            const [codes, _start, end] = setupCodeModifies.shift();
            for (const code of codes) {
                yield code;
            }
            if (setupCodeModifies.length) {
                const nextStart = setupCodeModifies[0][1];
                yield (0, common_1.generateSfcBlockSection)(scriptSetup, end, nextStart, index_1.codeFeatures.all);
            }
            else {
                yield (0, common_1.generateSfcBlockSection)(scriptSetup, end, scriptSetup.content.length, index_1.codeFeatures.all);
            }
        }
    }
    else {
        yield (0, common_1.generateSfcBlockSection)(scriptSetup, scriptSetupRanges.importSectionEndOffset, scriptSetup.content.length, index_1.codeFeatures.all);
    }
    if (scriptSetupRanges.props.define?.typeArg && scriptSetupRanges.props.withDefaults?.arg) {
        // fix https://github.com/vuejs/language-tools/issues/1187
        yield `const __VLS_withDefaultsArg = (function <T>(t: T) { return t })(`;
        yield (0, common_1.generateSfcBlockSection)(scriptSetup, scriptSetupRanges.props.withDefaults.arg.start, scriptSetupRanges.props.withDefaults.arg.end, index_1.codeFeatures.navigation);
        yield `)${common_1.endOfLine}`;
    }
    yield* generateComponentProps(options, ctx, scriptSetup, scriptSetupRanges, definePropMirrors);
    yield* generateModelEmits(options, scriptSetup, scriptSetupRanges);
    yield* (0, template_1.generateTemplate)(options, ctx, false);
    if (syntax) {
        if (!options.vueCompilerOptions.skipTemplateCodegen && (options.templateCodegen?.hasSlot || scriptSetupRanges?.slots.define)) {
            yield `const __VLS_component = `;
            yield* (0, component_1.generateComponent)(options, ctx, scriptSetup, scriptSetupRanges);
            yield common_1.endOfLine;
            yield `${syntax} `;
            yield `{} as ${ctx.helperTypes.WithTemplateSlots.name}<typeof __VLS_component, ReturnType<typeof __VLS_template>>${common_1.endOfLine}`;
        }
        else {
            yield `${syntax} `;
            yield* (0, component_1.generateComponent)(options, ctx, scriptSetup, scriptSetupRanges);
            yield common_1.endOfLine;
        }
    }
}
function* generateComponentProps(options, ctx, scriptSetup, scriptSetupRanges, definePropMirrors) {
    yield `const __VLS_fnComponent = `
        + `(await import('${options.vueCompilerOptions.lib}')).defineComponent({${common_1.newLine}`;
    if (scriptSetupRanges.props.define?.arg) {
        yield `	props: `;
        yield (0, common_1.generateSfcBlockSection)(scriptSetup, scriptSetupRanges.props.define.arg.start, scriptSetupRanges.props.define.arg.end, index_1.codeFeatures.navigation);
        yield `,${common_1.newLine}`;
    }
    yield* (0, component_1.generateEmitsOption)(options, scriptSetup, scriptSetupRanges);
    yield `})${common_1.endOfLine}`;
    yield `type __VLS_BuiltInPublicProps = ${options.vueCompilerOptions.target >= 3.4
        ? `import('${options.vueCompilerOptions.lib}').PublicProps;`
        : options.vueCompilerOptions.target >= 3.0
            ? `import('${options.vueCompilerOptions.lib}').VNodeProps
					& import('${options.vueCompilerOptions.lib}').AllowedComponentProps
					& import('${options.vueCompilerOptions.lib}').ComponentCustomProps;`
            : `globalThis.JSX.IntrinsicAttributes;`}`;
    yield common_1.endOfLine;
    yield `let __VLS_functionalComponentProps!: `;
    yield `${ctx.helperTypes.OmitKeepDiscriminatedUnion.name}<InstanceType<typeof __VLS_fnComponent>['$props'], keyof __VLS_BuiltInPublicProps>`;
    yield common_1.endOfLine;
    if (scriptSetupRanges.defineProp.length) {
        yield `const __VLS_defaults = {${common_1.newLine}`;
        for (const defineProp of scriptSetupRanges.defineProp) {
            if (defineProp.defaultValue) {
                if (defineProp.name) {
                    yield scriptSetup.content.substring(defineProp.name.start, defineProp.name.end);
                }
                else {
                    yield `modelValue`;
                }
                yield `: `;
                yield scriptSetup.content.substring(defineProp.defaultValue.start, defineProp.defaultValue.end);
                yield `,${common_1.newLine}`;
            }
        }
        yield `}${common_1.endOfLine}`;
    }
    yield `type __VLS_PublicProps = `;
    if (scriptSetupRanges.slots.define && options.vueCompilerOptions.jsxSlots) {
        if (ctx.generatedPropsType) {
            yield ` & `;
        }
        ctx.generatedPropsType = true;
        yield `${ctx.helperTypes.PropsChildren.name}<typeof __VLS_slots>`;
    }
    if (scriptSetupRanges.defineProp.length) {
        if (ctx.generatedPropsType) {
            yield ` & `;
        }
        ctx.generatedPropsType = true;
        yield `{${common_1.newLine}`;
        for (const defineProp of scriptSetupRanges.defineProp) {
            let propName = 'modelValue';
            if (defineProp.name && defineProp.nameIsString) {
                // renaming support
                yield (0, common_1.generateSfcBlockSection)(scriptSetup, defineProp.name.start, defineProp.name.end, index_1.codeFeatures.navigation);
                propName = scriptSetup.content.substring(defineProp.name.start, defineProp.name.end);
                propName = propName.replace(/['"]+/g, '');
            }
            else if (defineProp.name) {
                propName = scriptSetup.content.substring(defineProp.name.start, defineProp.name.end);
                definePropMirrors.set(propName, options.getGeneratedLength());
                yield propName;
            }
            else {
                yield propName;
            }
            yield defineProp.required
                ? `: `
                : `?: `;
            yield* generateDefinePropType(scriptSetup, propName, defineProp);
            yield `,${common_1.newLine}`;
            if (defineProp.modifierType) {
                let propModifierName = 'modelModifiers';
                if (defineProp.name) {
                    propModifierName = `${scriptSetup.content.substring(defineProp.name.start + 1, defineProp.name.end - 1)}Modifiers`;
                }
                const modifierType = scriptSetup.content.substring(defineProp.modifierType.start, defineProp.modifierType.end);
                definePropMirrors.set(propModifierName, options.getGeneratedLength());
                yield `${propModifierName}?: Record<${modifierType}, true>,${common_1.endOfLine}`;
            }
        }
        yield `}`;
    }
    if (scriptSetupRanges.props.define?.typeArg) {
        if (ctx.generatedPropsType) {
            yield ` & `;
        }
        ctx.generatedPropsType = true;
        yield `typeof __VLS_typeProps`;
    }
    if (!ctx.generatedPropsType) {
        yield `{}`;
    }
    yield common_1.endOfLine;
}
function* generateModelEmits(options, scriptSetup, scriptSetupRanges) {
    yield `type __VLS_ModelEmitsType = `;
    if (scriptSetupRanges.defineProp.filter(p => p.isModel).length) {
        if (options.vueCompilerOptions.target < 3.5) {
            yield `typeof __VLS_modelEmitsType${common_1.endOfLine}`;
            yield `const __VLS_modelEmitsType = (await import('${options.vueCompilerOptions.lib}')).defineEmits<`;
        }
        yield `{${common_1.newLine}`;
        for (const defineProp of scriptSetupRanges.defineProp) {
            if (!defineProp.isModel) {
                continue;
            }
            let propName = 'modelValue';
            if (defineProp.name) {
                propName = scriptSetup.content.substring(defineProp.name.start, defineProp.name.end);
                propName = propName.replace(/['"]+/g, '');
            }
            yield `'update:${propName}': [${propName}:`;
            yield* generateDefinePropType(scriptSetup, propName, defineProp);
            yield `]${common_1.endOfLine}`;
        }
        yield `}`;
        if (options.vueCompilerOptions.target < 3.5) {
            yield `>()`;
        }
    }
    else {
        yield `{}`;
    }
    yield common_1.endOfLine;
}
function* generateDefinePropType(scriptSetup, propName, defineProp) {
    if (defineProp.type) {
        // Infer from defineProp<T>
        yield scriptSetup.content.substring(defineProp.type.start, defineProp.type.end);
    }
    else if ((defineProp.name && defineProp.nameIsString) || !defineProp.nameIsString) {
        // Infer from actual prop declaration code 
        yield `NonNullable<typeof ${propName}['value']>`;
    }
    else if (defineProp.defaultValue) {
        // Infer from defineProp({default: T})
        yield `typeof __VLS_defaults['${propName}']`;
    }
    else {
        yield `any`;
    }
}
//# sourceMappingURL=scriptSetup.js.map