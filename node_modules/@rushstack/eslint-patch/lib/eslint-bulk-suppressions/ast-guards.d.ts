import type { TSESTree } from '@typescript-eslint/types';
export declare function isArrayExpression(node: TSESTree.Node): node is TSESTree.ArrayExpression;
export declare function isArrowFunctionExpression(node: TSESTree.Node): node is TSESTree.ArrowFunctionExpression;
/** default parameters */
export declare function isAssignmentPattern(node: TSESTree.Node): node is TSESTree.AssignmentPattern;
export declare function isClassDeclaration(node: TSESTree.Node): node is TSESTree.ClassDeclaration;
export declare function isClassExpression(node: TSESTree.Node): node is TSESTree.ClassExpression;
export declare function isExportDefaultDeclaration(node: TSESTree.Node): node is TSESTree.ExportDefaultDeclaration;
export declare function isExpression(node: TSESTree.Node): node is TSESTree.Expression;
export declare function isFunctionDeclaration(node: TSESTree.Node): node is TSESTree.FunctionDeclaration;
export declare function isFunctionExpression(node: TSESTree.Node): node is TSESTree.FunctionExpression;
export declare function isIdentifier(node: TSESTree.Node): node is TSESTree.Identifier;
export declare function isLiteral(node: TSESTree.Node): node is TSESTree.Literal;
export declare function isMethodDefinition(node: TSESTree.Node): node is TSESTree.MethodDefinition;
export declare function isObjectExpression(node: TSESTree.Node): node is TSESTree.ObjectExpression;
export declare function isPrivateIdentifier(node: TSESTree.Node): node is TSESTree.PrivateIdentifier;
export declare function isProperty(node: TSESTree.Node): node is TSESTree.Property;
export declare function isPropertyDefinition(node: TSESTree.Node): node is TSESTree.PropertyDefinition;
export declare function isTSEnumDeclaration(node: TSESTree.Node): node is TSESTree.TSEnumDeclaration;
export declare function isTSInterfaceDeclaration(node: TSESTree.Node): node is TSESTree.TSInterfaceDeclaration;
export declare function isTSModuleDeclaration(node: TSESTree.Node): node is TSESTree.TSModuleDeclaration;
export declare function isTSQualifiedName(node: TSESTree.Node): node is TSESTree.TSQualifiedName;
export declare function isTSTypeAliasDeclaration(node: TSESTree.Node): node is TSESTree.TSTypeAliasDeclaration;
export declare function isVariableDeclarator(node: TSESTree.Node): node is TSESTree.VariableDeclarator;
export declare function isClassDeclarationWithName(node: TSESTree.Node): node is TSESTree.ClassDeclarationWithName;
export declare function isClassPropertyNameNonComputed(node: TSESTree.Node): node is TSESTree.ClassPropertyNameNonComputed;
export declare function isFunctionDeclarationWithName(node: TSESTree.Node): node is TSESTree.FunctionDeclarationWithName;
export declare function isNumberLiteral(node: TSESTree.Node): node is TSESTree.NumberLiteral;
export declare function isPropertyNameNonComputed(node: TSESTree.Node): node is TSESTree.PropertyNameNonComputed;
export declare function isStringLiteral(node: TSESTree.Node): node is TSESTree.StringLiteral;
export interface ClassExpressionWithName extends TSESTree.ClassExpression {
    id: TSESTree.Identifier;
}
export declare function isClassExpressionWithName(node: TSESTree.Node): node is ClassExpressionWithName;
export interface FunctionExpressionWithName extends TSESTree.FunctionExpression {
    id: TSESTree.Identifier;
}
export declare function isFunctionExpressionWithName(node: TSESTree.Node): node is FunctionExpressionWithName;
export type NormalAnonymousExpression = TSESTree.ArrowFunctionExpression | TSESTree.ClassExpression | TSESTree.FunctionExpression | TSESTree.ObjectExpression;
export declare function isNormalAnonymousExpression(node: TSESTree.Node): node is NormalAnonymousExpression;
export interface NormalAssignmentPattern extends TSESTree.AssignmentPattern {
    left: TSESTree.Identifier;
}
export declare function isNormalAssignmentPattern(node: TSESTree.Node): node is NormalAssignmentPattern;
export interface NormalClassPropertyDefinition extends TSESTree.PropertyDefinitionNonComputedName {
    key: TSESTree.PrivateIdentifier | TSESTree.Identifier;
    value: TSESTree.Expression;
}
export declare function isNormalClassPropertyDefinition(node: TSESTree.Node): node is NormalClassPropertyDefinition;
export interface NormalMethodDefinition extends TSESTree.MethodDefinitionNonComputedName {
    key: TSESTree.PrivateIdentifier | TSESTree.Identifier;
}
export declare function isNormalMethodDefinition(node: TSESTree.Node): node is NormalMethodDefinition;
export interface NormalObjectProperty extends TSESTree.PropertyNonComputedName {
    key: TSESTree.Identifier;
}
export declare function isNormalObjectProperty(node: TSESTree.Node): node is NormalObjectProperty;
export interface NormalVariableDeclarator extends TSESTree.VariableDeclarator {
    id: TSESTree.Identifier;
    init: TSESTree.Expression;
}
export declare function isNormalVariableDeclarator(node: TSESTree.Node): node is NormalVariableDeclarator;
export interface NormalAssignmentPatternWithAnonymousExpressionAssigned extends NormalAssignmentPattern {
    right: NormalAnonymousExpression;
}
export declare function isNormalAssignmentPatternWithAnonymousExpressionAssigned(node: TSESTree.Node): node is NormalAssignmentPatternWithAnonymousExpressionAssigned;
export interface NormalVariableDeclaratorWithAnonymousExpressionAssigned extends NormalVariableDeclarator {
    init: NormalAnonymousExpression;
}
export declare function isNormalVariableDeclaratorWithAnonymousExpressionAssigned(node: TSESTree.Node): node is NormalVariableDeclaratorWithAnonymousExpressionAssigned;
export interface NormalObjectPropertyWithAnonymousExpressionAssigned extends NormalObjectProperty {
    value: NormalAnonymousExpression;
}
export declare function isNormalObjectPropertyWithAnonymousExpressionAssigned(node: TSESTree.Node): node is NormalObjectPropertyWithAnonymousExpressionAssigned;
export interface NormalClassPropertyDefinitionWithAnonymousExpressionAssigned extends NormalClassPropertyDefinition {
    value: NormalAnonymousExpression;
}
export declare function isNormalClassPropertyDefinitionWithAnonymousExpressionAssigned(node: TSESTree.Node): node is NormalClassPropertyDefinitionWithAnonymousExpressionAssigned;
export type NodeWithName = TSESTree.ClassDeclarationWithName | TSESTree.FunctionDeclarationWithName | ClassExpressionWithName | FunctionExpressionWithName | NormalVariableDeclaratorWithAnonymousExpressionAssigned | NormalObjectPropertyWithAnonymousExpressionAssigned | NormalClassPropertyDefinitionWithAnonymousExpressionAssigned | NormalAssignmentPatternWithAnonymousExpressionAssigned | NormalMethodDefinition | TSESTree.TSEnumDeclaration | TSESTree.TSInterfaceDeclaration | TSESTree.TSTypeAliasDeclaration;
export declare function isNodeWithName(node: TSESTree.Node): node is NodeWithName;
//# sourceMappingURL=ast-guards.d.ts.map