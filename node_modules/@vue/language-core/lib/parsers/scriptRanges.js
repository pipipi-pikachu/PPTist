"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseScriptRanges = parseScriptRanges;
const scriptSetupRanges_1 = require("./scriptSetupRanges");
function parseScriptRanges(ts, ast, hasScriptSetup, withNode) {
    let exportDefault;
    let classBlockEnd;
    const bindings = hasScriptSetup ? (0, scriptSetupRanges_1.parseBindingRanges)(ts, ast) : [];
    ts.forEachChild(ast, raw => {
        if (ts.isExportAssignment(raw)) {
            let node = raw;
            while (isAsExpression(node.expression) || ts.isParenthesizedExpression(node.expression)) { // fix https://github.com/vuejs/language-tools/issues/1882
                node = node.expression;
            }
            let obj;
            if (ts.isObjectLiteralExpression(node.expression)) {
                obj = node.expression;
            }
            else if (ts.isCallExpression(node.expression) && node.expression.arguments.length) {
                const arg0 = node.expression.arguments[0];
                if (ts.isObjectLiteralExpression(arg0)) {
                    obj = arg0;
                }
            }
            if (obj) {
                let componentsOptionNode;
                let nameOptionNode;
                ts.forEachChild(obj, node => {
                    if (ts.isPropertyAssignment(node) && ts.isIdentifier(node.name)) {
                        const name = (0, scriptSetupRanges_1.getNodeText)(ts, node.name, ast);
                        if (name === 'components' && ts.isObjectLiteralExpression(node.initializer)) {
                            componentsOptionNode = node.initializer;
                        }
                        if (name === 'name') {
                            nameOptionNode = node.initializer;
                        }
                    }
                });
                exportDefault = {
                    ..._getStartEnd(raw),
                    expression: _getStartEnd(node.expression),
                    args: _getStartEnd(obj),
                    argsNode: withNode ? obj : undefined,
                    componentsOption: componentsOptionNode ? _getStartEnd(componentsOptionNode) : undefined,
                    componentsOptionNode: withNode ? componentsOptionNode : undefined,
                    nameOption: nameOptionNode ? _getStartEnd(nameOptionNode) : undefined,
                };
            }
        }
        if (ts.isClassDeclaration(raw)
            && raw.modifiers?.some(mod => mod.kind === ts.SyntaxKind.ExportKeyword)
            && raw.modifiers?.some(mod => mod.kind === ts.SyntaxKind.DefaultKeyword)) {
            classBlockEnd = raw.end - 1;
        }
    });
    return {
        exportDefault,
        classBlockEnd,
        bindings,
    };
    function _getStartEnd(node) {
        return (0, scriptSetupRanges_1.getStartEnd)(ts, node, ast);
    }
    // isAsExpression is missing in tsc
    function isAsExpression(node) {
        return node.kind === ts.SyntaxKind.AsExpression;
    }
}
//# sourceMappingURL=scriptRanges.js.map