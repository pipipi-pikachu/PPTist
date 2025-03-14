"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNodeWithName = exports.isNormalClassPropertyDefinitionWithAnonymousExpressionAssigned = exports.isNormalObjectPropertyWithAnonymousExpressionAssigned = exports.isNormalVariableDeclaratorWithAnonymousExpressionAssigned = exports.isNormalAssignmentPatternWithAnonymousExpressionAssigned = exports.isNormalVariableDeclarator = exports.isNormalObjectProperty = exports.isNormalMethodDefinition = exports.isNormalClassPropertyDefinition = exports.isNormalAssignmentPattern = exports.isNormalAnonymousExpression = exports.isFunctionExpressionWithName = exports.isClassExpressionWithName = exports.isStringLiteral = exports.isPropertyNameNonComputed = exports.isNumberLiteral = exports.isFunctionDeclarationWithName = exports.isClassPropertyNameNonComputed = exports.isClassDeclarationWithName = exports.isVariableDeclarator = exports.isTSTypeAliasDeclaration = exports.isTSQualifiedName = exports.isTSModuleDeclaration = exports.isTSInterfaceDeclaration = exports.isTSEnumDeclaration = exports.isPropertyDefinition = exports.isProperty = exports.isPrivateIdentifier = exports.isObjectExpression = exports.isMethodDefinition = exports.isLiteral = exports.isIdentifier = exports.isFunctionExpression = exports.isFunctionDeclaration = exports.isExpression = exports.isExportDefaultDeclaration = exports.isClassExpression = exports.isClassDeclaration = exports.isAssignmentPattern = exports.isArrowFunctionExpression = exports.isArrayExpression = void 0;
function isArrayExpression(node) {
    return node.type === 'ArrayExpression';
}
exports.isArrayExpression = isArrayExpression;
function isArrowFunctionExpression(node) {
    return node.type === 'ArrowFunctionExpression';
}
exports.isArrowFunctionExpression = isArrowFunctionExpression;
/** default parameters */
function isAssignmentPattern(node) {
    return node.type === 'AssignmentPattern';
}
exports.isAssignmentPattern = isAssignmentPattern;
function isClassDeclaration(node) {
    return node.type === 'ClassDeclaration';
}
exports.isClassDeclaration = isClassDeclaration;
function isClassExpression(node) {
    return node.type === 'ClassExpression';
}
exports.isClassExpression = isClassExpression;
function isExportDefaultDeclaration(node) {
    return node.type === 'ExportDefaultDeclaration';
}
exports.isExportDefaultDeclaration = isExportDefaultDeclaration;
function isExpression(node) {
    return node.type.includes('Expression');
}
exports.isExpression = isExpression;
function isFunctionDeclaration(node) {
    return node.type === 'FunctionDeclaration';
}
exports.isFunctionDeclaration = isFunctionDeclaration;
function isFunctionExpression(node) {
    return node.type === 'FunctionExpression';
}
exports.isFunctionExpression = isFunctionExpression;
function isIdentifier(node) {
    return node.type === 'Identifier';
}
exports.isIdentifier = isIdentifier;
function isLiteral(node) {
    return node.type === 'Literal';
}
exports.isLiteral = isLiteral;
function isMethodDefinition(node) {
    return node.type === 'MethodDefinition';
}
exports.isMethodDefinition = isMethodDefinition;
function isObjectExpression(node) {
    return node.type === 'ObjectExpression';
}
exports.isObjectExpression = isObjectExpression;
function isPrivateIdentifier(node) {
    return node.type === 'PrivateIdentifier';
}
exports.isPrivateIdentifier = isPrivateIdentifier;
function isProperty(node) {
    return node.type === 'Property';
}
exports.isProperty = isProperty;
function isPropertyDefinition(node) {
    return node.type === 'PropertyDefinition';
}
exports.isPropertyDefinition = isPropertyDefinition;
function isTSEnumDeclaration(node) {
    return node.type === 'TSEnumDeclaration';
}
exports.isTSEnumDeclaration = isTSEnumDeclaration;
function isTSInterfaceDeclaration(node) {
    return node.type === 'TSInterfaceDeclaration';
}
exports.isTSInterfaceDeclaration = isTSInterfaceDeclaration;
function isTSModuleDeclaration(node) {
    return node.type === 'TSModuleDeclaration';
}
exports.isTSModuleDeclaration = isTSModuleDeclaration;
function isTSQualifiedName(node) {
    return node.type === 'TSQualifiedName';
}
exports.isTSQualifiedName = isTSQualifiedName;
function isTSTypeAliasDeclaration(node) {
    return node.type === 'TSTypeAliasDeclaration';
}
exports.isTSTypeAliasDeclaration = isTSTypeAliasDeclaration;
function isVariableDeclarator(node) {
    return node.type === 'VariableDeclarator';
}
exports.isVariableDeclarator = isVariableDeclarator;
// Compound Type Guards for @typescript-eslint/types ast-spec compound types
function isClassDeclarationWithName(node) {
    return isClassDeclaration(node) && node.id !== null;
}
exports.isClassDeclarationWithName = isClassDeclarationWithName;
function isClassPropertyNameNonComputed(node) {
    return isPrivateIdentifier(node) || isPropertyNameNonComputed(node);
}
exports.isClassPropertyNameNonComputed = isClassPropertyNameNonComputed;
function isFunctionDeclarationWithName(node) {
    return isFunctionDeclaration(node) && node.id !== null;
}
exports.isFunctionDeclarationWithName = isFunctionDeclarationWithName;
function isNumberLiteral(node) {
    return isLiteral(node) && typeof node.value === 'number';
}
exports.isNumberLiteral = isNumberLiteral;
function isPropertyNameNonComputed(node) {
    return isIdentifier(node) || isNumberLiteral(node) || isStringLiteral(node);
}
exports.isPropertyNameNonComputed = isPropertyNameNonComputed;
function isStringLiteral(node) {
    return isLiteral(node) && typeof node.value === 'string';
}
exports.isStringLiteral = isStringLiteral;
function isClassExpressionWithName(node) {
    return isClassExpression(node) && node.id !== null;
}
exports.isClassExpressionWithName = isClassExpressionWithName;
function isFunctionExpressionWithName(node) {
    return isFunctionExpression(node) && node.id !== null;
}
exports.isFunctionExpressionWithName = isFunctionExpressionWithName;
function isNormalAnonymousExpression(node) {
    const ANONYMOUS_EXPRESSION_GUARDS = [
        isArrowFunctionExpression,
        isClassExpression,
        isFunctionExpression,
        isObjectExpression
    ];
    return ANONYMOUS_EXPRESSION_GUARDS.some((guard) => guard(node));
}
exports.isNormalAnonymousExpression = isNormalAnonymousExpression;
function isNormalAssignmentPattern(node) {
    return isAssignmentPattern(node) && isIdentifier(node.left);
}
exports.isNormalAssignmentPattern = isNormalAssignmentPattern;
function isNormalClassPropertyDefinition(node) {
    return (isPropertyDefinition(node) &&
        (isIdentifier(node.key) || isPrivateIdentifier(node.key)) &&
        node.value !== null);
}
exports.isNormalClassPropertyDefinition = isNormalClassPropertyDefinition;
function isNormalMethodDefinition(node) {
    return isMethodDefinition(node) && (isIdentifier(node.key) || isPrivateIdentifier(node.key));
}
exports.isNormalMethodDefinition = isNormalMethodDefinition;
function isNormalObjectProperty(node) {
    return isProperty(node) && (isIdentifier(node.key) || isPrivateIdentifier(node.key));
}
exports.isNormalObjectProperty = isNormalObjectProperty;
function isNormalVariableDeclarator(node) {
    return isVariableDeclarator(node) && isIdentifier(node.id) && node.init !== null;
}
exports.isNormalVariableDeclarator = isNormalVariableDeclarator;
function isNormalAssignmentPatternWithAnonymousExpressionAssigned(node) {
    return isNormalAssignmentPattern(node) && isNormalAnonymousExpression(node.right);
}
exports.isNormalAssignmentPatternWithAnonymousExpressionAssigned = isNormalAssignmentPatternWithAnonymousExpressionAssigned;
function isNormalVariableDeclaratorWithAnonymousExpressionAssigned(node) {
    return isNormalVariableDeclarator(node) && isNormalAnonymousExpression(node.init);
}
exports.isNormalVariableDeclaratorWithAnonymousExpressionAssigned = isNormalVariableDeclaratorWithAnonymousExpressionAssigned;
function isNormalObjectPropertyWithAnonymousExpressionAssigned(node) {
    return isNormalObjectProperty(node) && isNormalAnonymousExpression(node.value);
}
exports.isNormalObjectPropertyWithAnonymousExpressionAssigned = isNormalObjectPropertyWithAnonymousExpressionAssigned;
function isNormalClassPropertyDefinitionWithAnonymousExpressionAssigned(node) {
    return isNormalClassPropertyDefinition(node) && isNormalAnonymousExpression(node.value);
}
exports.isNormalClassPropertyDefinitionWithAnonymousExpressionAssigned = isNormalClassPropertyDefinitionWithAnonymousExpressionAssigned;
function isNodeWithName(node) {
    return (isClassDeclarationWithName(node) ||
        isFunctionDeclarationWithName(node) ||
        isClassExpressionWithName(node) ||
        isFunctionExpressionWithName(node) ||
        isNormalVariableDeclaratorWithAnonymousExpressionAssigned(node) ||
        isNormalObjectPropertyWithAnonymousExpressionAssigned(node) ||
        isNormalClassPropertyDefinitionWithAnonymousExpressionAssigned(node) ||
        isNormalAssignmentPatternWithAnonymousExpressionAssigned(node) ||
        isNormalMethodDefinition(node) ||
        isTSEnumDeclaration(node) ||
        isTSInterfaceDeclaration(node) ||
        isTSTypeAliasDeclaration(node));
}
exports.isNodeWithName = isNodeWithName;
//# sourceMappingURL=ast-guards.js.map