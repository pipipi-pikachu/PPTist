"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateComponent = generateComponent;
exports.generateElement = generateElement;
exports.getCanonicalComponentName = getCanonicalComponentName;
exports.getPossibleOriginalComponentNames = getPossibleOriginalComponentNames;
const CompilerDOM = require("@vue/compiler-dom");
const shared_1 = require("@vue/shared");
const shared_2 = require("../../utils/shared");
const common_1 = require("../common");
const camelized_1 = require("./camelized");
const elementChildren_1 = require("./elementChildren");
const elementDirectives_1 = require("./elementDirectives");
const elementEvents_1 = require("./elementEvents");
const elementProps_1 = require("./elementProps");
const interpolation_1 = require("./interpolation");
const propertyAccess_1 = require("./propertyAccess");
const templateChild_1 = require("./templateChild");
const objectProperty_1 = require("./objectProperty");
const colonReg = /:/g;
function* generateComponent(options, ctx, node, currentComponent, componentCtxVar) {
    const startTagOffset = node.loc.start.offset + options.template.content.substring(node.loc.start.offset).indexOf(node.tag);
    const endTagOffset = !node.isSelfClosing && options.template.lang === 'html' ? node.loc.start.offset + node.loc.source.lastIndexOf(node.tag) : undefined;
    const tagOffsets = endTagOffset !== undefined
        ? [startTagOffset, endTagOffset]
        : [startTagOffset];
    const propsFailedExps = [];
    const possibleOriginalNames = getPossibleOriginalComponentNames(node.tag, true);
    const matchImportName = possibleOriginalNames.find(name => options.scriptSetupImportComponentNames.has(name));
    const var_originalComponent = matchImportName ?? ctx.getInternalVariable();
    const var_functionalComponent = ctx.getInternalVariable();
    const var_componentInstance = ctx.getInternalVariable();
    const var_componentEmit = ctx.getInternalVariable();
    const var_componentEvents = ctx.getInternalVariable();
    const var_defineComponentCtx = ctx.getInternalVariable();
    const isComponentTag = node.tag.toLowerCase() === 'component';
    let props = node.props;
    let dynamicTagInfo;
    if (isComponentTag) {
        for (const prop of node.props) {
            if (prop.type === CompilerDOM.NodeTypes.DIRECTIVE && prop.name === 'bind' && prop.arg?.loc.source === 'is' && prop.exp) {
                dynamicTagInfo = {
                    exp: prop.exp.loc.source,
                    offset: prop.exp.loc.start.offset,
                    astHolder: prop.exp.loc,
                };
                props = props.filter(p => p !== prop);
                break;
            }
        }
    }
    else if (node.tag.includes('.')) {
        // namespace tag
        dynamicTagInfo = {
            exp: node.tag,
            astHolder: node.loc,
            offset: startTagOffset,
        };
    }
    if (matchImportName) {
        // hover, renaming / find references support
        yield `// @ts-ignore${common_1.newLine}`; // #2304
        yield `[`;
        for (const tagOffset of tagOffsets) {
            if (var_originalComponent === node.tag) {
                yield [
                    var_originalComponent,
                    'template',
                    tagOffset,
                    ctx.codeFeatures.withoutHighlightAndCompletion,
                ];
            }
            else {
                yield* (0, camelized_1.generateCamelized)((0, shared_1.capitalize)(node.tag), tagOffset, {
                    ...ctx.codeFeatures.withoutHighlightAndCompletion,
                    navigation: {
                        resolveRenameNewName: camelizeComponentName,
                        resolveRenameEditText: getTagRenameApply(node.tag),
                    },
                });
            }
            yield `,`;
        }
        yield `]${common_1.endOfLine}`;
    }
    else if (dynamicTagInfo) {
        yield `const ${var_originalComponent} = `;
        yield* (0, interpolation_1.generateInterpolation)(options, ctx, dynamicTagInfo.exp, dynamicTagInfo.astHolder, dynamicTagInfo.offset, ctx.codeFeatures.all, '(', ')');
        yield common_1.endOfLine;
    }
    else if (!isComponentTag) {
        yield `// @ts-ignore${common_1.newLine}`;
        yield `const ${var_originalComponent} = ({} as `;
        for (const componentName of possibleOriginalNames) {
            yield `'${componentName}' extends keyof typeof __VLS_ctx ? { '${getCanonicalComponentName(node.tag)}': typeof __VLS_ctx`;
            yield* (0, propertyAccess_1.generatePropertyAccess)(options, ctx, componentName);
            yield ` }: `;
        }
        yield `typeof __VLS_resolvedLocalAndGlobalComponents)${common_1.newLine}`;
        yield* (0, propertyAccess_1.generatePropertyAccess)(options, ctx, getCanonicalComponentName(node.tag), startTagOffset, ctx.codeFeatures.verification);
        yield common_1.endOfLine;
        // hover support
        for (const offset of tagOffsets) {
            yield `({} as { ${getCanonicalComponentName(node.tag)}: typeof ${var_originalComponent} }).`;
            yield* generateCanonicalComponentName(node.tag, offset, ctx.codeFeatures.withoutHighlightAndCompletionAndNavigation);
            yield common_1.endOfLine;
        }
        const camelizedTag = (0, shared_1.camelize)(node.tag);
        if (common_1.variableNameRegex.test(camelizedTag)) {
            // renaming / find references support
            for (const tagOffset of tagOffsets) {
                for (const shouldCapitalize of (node.tag[0] === node.tag[0].toUpperCase() ? [false] : [true, false])) {
                    const expectName = shouldCapitalize ? (0, shared_1.capitalize)(camelizedTag) : camelizedTag;
                    yield `__VLS_components.`;
                    yield* (0, camelized_1.generateCamelized)(shouldCapitalize ? (0, shared_1.capitalize)(node.tag) : node.tag, tagOffset, {
                        navigation: {
                            resolveRenameNewName: node.tag !== expectName ? camelizeComponentName : undefined,
                            resolveRenameEditText: getTagRenameApply(node.tag),
                        },
                    });
                    yield `;`;
                }
            }
            yield `${common_1.newLine}`;
            // auto import support
            yield `// @ts-ignore${common_1.newLine}`; // #2304
            yield `[`;
            for (const tagOffset of tagOffsets) {
                yield* (0, camelized_1.generateCamelized)((0, shared_1.capitalize)(node.tag), tagOffset, {
                    completion: {
                        isAdditional: true,
                        onlyImport: true,
                    },
                });
                yield `,`;
            }
            yield `]${common_1.endOfLine}`;
        }
    }
    else {
        yield `const ${var_originalComponent} = {} as any${common_1.endOfLine}`;
    }
    yield `// @ts-ignore${common_1.newLine}`;
    yield `const ${var_functionalComponent} = __VLS_asFunctionalComponent(${var_originalComponent}, new ${var_originalComponent}({`;
    yield* (0, elementProps_1.generateElementProps)(options, ctx, node, props, false);
    yield `}))${common_1.endOfLine}`;
    if (options.vueCompilerOptions.strictTemplates) {
        // with strictTemplates, generate once for props type-checking + instance type
        yield `const ${var_componentInstance} = ${var_functionalComponent}(`;
        yield* (0, common_1.wrapWith)(startTagOffset, startTagOffset + node.tag.length, ctx.codeFeatures.verification, `{`, ...(0, elementProps_1.generateElementProps)(options, ctx, node, props, true, propsFailedExps), `}`);
        yield `, ...__VLS_functionalComponentArgsRest(${var_functionalComponent}))${common_1.endOfLine}`;
    }
    else {
        // without strictTemplates, this only for instacne type
        yield `const ${var_componentInstance} = ${var_functionalComponent}({`;
        yield* (0, elementProps_1.generateElementProps)(options, ctx, node, props, false);
        yield `}, ...__VLS_functionalComponentArgsRest(${var_functionalComponent}))${common_1.endOfLine}`;
        // and this for props type-checking
        yield `({} as (props: __VLS_FunctionalComponentProps<typeof ${var_originalComponent}, typeof ${var_componentInstance}> & Record<string, unknown>) => void)(`;
        yield* (0, common_1.wrapWith)(startTagOffset, startTagOffset + node.tag.length, ctx.codeFeatures.verification, `{`, ...(0, elementProps_1.generateElementProps)(options, ctx, node, props, true, propsFailedExps), `}`);
        yield `)${common_1.endOfLine}`;
    }
    componentCtxVar = var_defineComponentCtx;
    currentComponent = node;
    for (const failedExp of propsFailedExps) {
        yield* (0, interpolation_1.generateInterpolation)(options, ctx, failedExp.node.loc.source, failedExp.node.loc, failedExp.node.loc.start.offset, ctx.codeFeatures.all, failedExp.prefix, failedExp.suffix);
        yield common_1.endOfLine;
    }
    yield* generateVScope(options, ctx, node, props);
    ctx.usedComponentCtxVars.add(componentCtxVar);
    const usedComponentEventsVar = yield* (0, elementEvents_1.generateElementEvents)(options, ctx, node, var_functionalComponent, var_componentInstance, var_componentEmit, var_componentEvents);
    if (var_defineComponentCtx && ctx.usedComponentCtxVars.has(var_defineComponentCtx)) {
        yield `const ${componentCtxVar} = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(${var_originalComponent}, ${var_componentInstance}))${common_1.endOfLine}`;
    }
    if (usedComponentEventsVar) {
        yield `let ${var_componentEmit}!: typeof ${componentCtxVar}.emit${common_1.endOfLine}`;
        yield `let ${var_componentEvents}!: __VLS_NormalizeEmits<typeof ${var_componentEmit}>${common_1.endOfLine}`;
    }
    const slotDir = node.props.find(p => p.type === CompilerDOM.NodeTypes.DIRECTIVE && p.name === 'slot');
    if (slotDir) {
        yield* generateComponentSlot(options, ctx, node, slotDir, currentComponent, componentCtxVar);
    }
    else {
        yield* (0, elementChildren_1.generateElementChildren)(options, ctx, node, currentComponent, componentCtxVar);
    }
}
function* generateElement(options, ctx, node, currentComponent, componentCtxVar) {
    const startTagOffset = node.loc.start.offset + options.template.content.substring(node.loc.start.offset).indexOf(node.tag);
    const endTagOffset = !node.isSelfClosing && options.template.lang === 'html'
        ? node.loc.start.offset + node.loc.source.lastIndexOf(node.tag)
        : undefined;
    const propsFailedExps = [];
    yield `__VLS_elementAsFunction(__VLS_intrinsicElements`;
    yield* (0, propertyAccess_1.generatePropertyAccess)(options, ctx, node.tag, startTagOffset, ctx.codeFeatures.withoutHighlightAndCompletion);
    if (endTagOffset !== undefined) {
        yield `, __VLS_intrinsicElements`;
        yield* (0, propertyAccess_1.generatePropertyAccess)(options, ctx, node.tag, endTagOffset, ctx.codeFeatures.withoutHighlightAndCompletion);
    }
    yield `)(`;
    yield* (0, common_1.wrapWith)(startTagOffset, startTagOffset + node.tag.length, ctx.codeFeatures.verification, `{`, ...(0, elementProps_1.generateElementProps)(options, ctx, node, node.props, true, propsFailedExps), `}`);
    yield `)${common_1.endOfLine}`;
    for (const failedExp of propsFailedExps) {
        yield* (0, interpolation_1.generateInterpolation)(options, ctx, failedExp.node.loc.source, failedExp.node.loc, failedExp.node.loc.start.offset, ctx.codeFeatures.all, failedExp.prefix, failedExp.suffix);
        yield common_1.endOfLine;
    }
    yield* generateVScope(options, ctx, node, node.props);
    const slotDir = node.props.find(p => p.type === CompilerDOM.NodeTypes.DIRECTIVE && p.name === 'slot');
    if (slotDir && componentCtxVar) {
        yield* generateComponentSlot(options, ctx, node, slotDir, currentComponent, componentCtxVar);
    }
    else {
        yield* (0, elementChildren_1.generateElementChildren)(options, ctx, node, currentComponent, componentCtxVar);
    }
}
function* generateVScope(options, ctx, node, props) {
    const vScope = props.find(prop => prop.type === CompilerDOM.NodeTypes.DIRECTIVE && (prop.name === 'scope' || prop.name === 'data'));
    let inScope = false;
    let originalConditionsNum = ctx.blockConditions.length;
    if (vScope?.type === CompilerDOM.NodeTypes.DIRECTIVE && vScope.exp) {
        const scopeVar = ctx.getInternalVariable();
        const condition = `__VLS_withScope(__VLS_ctx, ${scopeVar})`;
        yield `const ${scopeVar} = `;
        yield [
            vScope.exp.loc.source,
            'template',
            vScope.exp.loc.start.offset,
            ctx.codeFeatures.all,
        ];
        yield common_1.endOfLine;
        yield `if (${condition}) {${common_1.newLine}`;
        ctx.blockConditions.push(condition);
        inScope = true;
    }
    yield* (0, elementDirectives_1.generateElementDirectives)(options, ctx, node);
    yield* generateReferencesForElements(options, ctx, node); // <el ref="foo" />
    yield* generateReferencesForScopedCssClasses(ctx, node);
    if (inScope) {
        yield `}${common_1.newLine}`;
        ctx.blockConditions.length = originalConditionsNum;
    }
}
function getCanonicalComponentName(tagText) {
    return common_1.variableNameRegex.test(tagText)
        ? tagText
        : (0, shared_1.capitalize)((0, shared_1.camelize)(tagText.replace(colonReg, '-')));
}
function getPossibleOriginalComponentNames(tagText, deduplicate) {
    const name1 = (0, shared_1.capitalize)((0, shared_1.camelize)(tagText));
    const name2 = (0, shared_1.camelize)(tagText);
    const name3 = tagText;
    const names = [name1];
    if (!deduplicate || name2 !== name1) {
        names.push(name2);
    }
    if (!deduplicate || name3 !== name2) {
        names.push(name3);
    }
    return names;
}
function* generateCanonicalComponentName(tagText, offset, features) {
    if (common_1.variableNameRegex.test(tagText)) {
        yield [tagText, 'template', offset, features];
    }
    else {
        yield* (0, camelized_1.generateCamelized)((0, shared_1.capitalize)(tagText.replace(colonReg, '-')), offset, features);
    }
}
function* generateComponentSlot(options, ctx, node, slotDir, currentComponent, componentCtxVar) {
    yield `{${common_1.newLine}`;
    ctx.usedComponentCtxVars.add(componentCtxVar);
    if (currentComponent) {
        ctx.hasSlotElements.add(currentComponent);
    }
    const slotBlockVars = [];
    yield `const {`;
    if (slotDir?.arg?.type === CompilerDOM.NodeTypes.SIMPLE_EXPRESSION && slotDir.arg.content) {
        yield* (0, objectProperty_1.generateObjectProperty)(options, ctx, slotDir.arg.loc.source, slotDir.arg.loc.start.offset, slotDir.arg.isStatic ? ctx.codeFeatures.withoutHighlight : ctx.codeFeatures.all, slotDir.arg.loc);
        yield ': __VLS_thisSlot';
    }
    else {
        yield `default: `;
        yield* (0, common_1.wrapWith)(slotDir.loc.start.offset, slotDir.loc.start.offset + (slotDir.loc.source.startsWith('#')
            ? '#'.length
            : slotDir.loc.source.startsWith('v-slot:')
                ? 'v-slot:'.length
                : 0), ctx.codeFeatures.withoutHighlightAndCompletion, `__VLS_thisSlot`);
    }
    yield `} = __VLS_nonNullable(${componentCtxVar}.slots)${common_1.endOfLine}`;
    if (slotDir?.exp?.type === CompilerDOM.NodeTypes.SIMPLE_EXPRESSION) {
        const slotAst = (0, common_1.createTsAst)(options.ts, slotDir, `(${slotDir.exp.content}) => {}`);
        (0, common_1.collectVars)(options.ts, slotAst, slotAst, slotBlockVars);
        if (!slotDir.exp.content.includes(':')) {
            yield `const [`;
            yield [
                slotDir.exp.content,
                'template',
                slotDir.exp.loc.start.offset,
                ctx.codeFeatures.all,
            ];
            yield `] = __VLS_getSlotParams(__VLS_thisSlot)${common_1.endOfLine}`;
        }
        else {
            yield `const `;
            yield [
                slotDir.exp.content,
                'template',
                slotDir.exp.loc.start.offset,
                ctx.codeFeatures.all,
            ];
            yield ` = __VLS_getSlotParam(__VLS_thisSlot)${common_1.endOfLine}`;
        }
    }
    for (const varName of slotBlockVars) {
        ctx.addLocalVariable(varName);
    }
    yield* ctx.resetDirectiveComments('end of slot children start');
    let prev;
    for (const childNode of node.children) {
        yield* (0, templateChild_1.generateTemplateChild)(options, ctx, childNode, currentComponent, prev, componentCtxVar);
        prev = childNode;
    }
    for (const varName of slotBlockVars) {
        ctx.removeLocalVariable(varName);
    }
    let isStatic = true;
    if (slotDir?.arg?.type === CompilerDOM.NodeTypes.SIMPLE_EXPRESSION) {
        isStatic = slotDir.arg.isStatic;
    }
    if (isStatic && slotDir && !slotDir.arg) {
        yield `__VLS_nonNullable(${componentCtxVar}.slots)['`;
        yield [
            '',
            'template',
            slotDir.loc.start.offset + (slotDir.loc.source.startsWith('#')
                ? '#'.length : slotDir.loc.source.startsWith('v-slot:')
                ? 'v-slot:'.length
                : 0),
            ctx.codeFeatures.completion,
        ];
        yield `'/* empty slot name completion */]${common_1.newLine}`;
    }
    yield* ctx.generateAutoImportCompletion();
    yield `}${common_1.newLine}`;
}
function* generateReferencesForElements(options, ctx, node) {
    for (const prop of node.props) {
        if (prop.type === CompilerDOM.NodeTypes.ATTRIBUTE
            && prop.name === 'ref'
            && prop.value) {
            yield `// @ts-ignore${common_1.newLine}`;
            yield* (0, interpolation_1.generateInterpolation)(options, ctx, prop.value.content, prop.value.loc, prop.value.loc.start.offset + 1, ctx.codeFeatures.navigation, '(', ')');
            yield common_1.endOfLine;
        }
    }
}
function* generateReferencesForScopedCssClasses(ctx, node) {
    for (const prop of node.props) {
        if (prop.type === CompilerDOM.NodeTypes.ATTRIBUTE
            && prop.name === 'class'
            && prop.value) {
            let startOffset = prop.value.loc.start.offset;
            let content = prop.value.loc.source;
            if ((content.startsWith(`'`) && content.endsWith(`'`))
                || (content.startsWith(`"`) && content.endsWith(`"`))) {
                startOffset++;
                content = content.slice(1, -1);
            }
            if (content) {
                let currentClassName = '';
                for (const char of (content + ' ')) {
                    if (char.trim() === '') {
                        if (currentClassName !== '') {
                            ctx.scopedClasses.push({ className: currentClassName, offset: startOffset });
                            startOffset += currentClassName.length;
                            currentClassName = '';
                        }
                        startOffset += char.length;
                    }
                    else {
                        currentClassName += char;
                    }
                }
            }
            else {
                ctx.emptyClassOffsets.push(startOffset);
            }
        }
        else if (prop.type === CompilerDOM.NodeTypes.DIRECTIVE
            && prop.arg?.type === CompilerDOM.NodeTypes.SIMPLE_EXPRESSION
            && prop.exp?.type === CompilerDOM.NodeTypes.SIMPLE_EXPRESSION
            && prop.arg.content === 'class') {
            yield `__VLS_styleScopedClasses = (`;
            yield [
                prop.exp.content,
                'template',
                prop.exp.loc.start.offset,
                ctx.codeFeatures.navigationAndCompletion,
            ];
            yield `)${common_1.endOfLine}`;
        }
    }
}
function camelizeComponentName(newName) {
    return (0, shared_1.camelize)('-' + newName);
}
function getTagRenameApply(oldName) {
    return oldName === (0, shared_2.hyphenateTag)(oldName) ? shared_2.hyphenateTag : undefined;
}
//# sourceMappingURL=element.js.map