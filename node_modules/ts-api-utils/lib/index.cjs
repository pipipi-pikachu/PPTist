"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  DeclarationDomain: () => DeclarationDomain,
  UsageDomain: () => UsageDomain,
  collectVariableUsage: () => collectVariableUsage,
  forEachComment: () => forEachComment,
  forEachToken: () => forEachToken,
  getCallSignaturesOfType: () => getCallSignaturesOfType,
  getPropertyOfType: () => getPropertyOfType,
  getWellKnownSymbolPropertyOfType: () => getWellKnownSymbolPropertyOfType,
  hasDecorators: () => hasDecorators,
  hasExpressionInitializer: () => hasExpressionInitializer,
  hasInitializer: () => hasInitializer,
  hasJSDoc: () => hasJSDoc,
  hasModifiers: () => hasModifiers,
  hasType: () => hasType,
  hasTypeArguments: () => hasTypeArguments,
  includesModifier: () => includesModifier,
  intersectionTypeParts: () => intersectionTypeParts,
  isAbstractKeyword: () => isAbstractKeyword,
  isAccessExpression: () => isAccessExpression,
  isAccessibilityModifier: () => isAccessibilityModifier,
  isAccessorDeclaration: () => isAccessorDeclaration,
  isAccessorKeyword: () => isAccessorKeyword,
  isAnyKeyword: () => isAnyKeyword,
  isArrayBindingElement: () => isArrayBindingElement,
  isArrayBindingOrAssignmentPattern: () => isArrayBindingOrAssignmentPattern,
  isAssertKeyword: () => isAssertKeyword,
  isAssertsKeyword: () => isAssertsKeyword,
  isAssignmentKind: () => isAssignmentKind,
  isAssignmentPattern: () => isAssignmentPattern,
  isAsyncKeyword: () => isAsyncKeyword,
  isAwaitKeyword: () => isAwaitKeyword,
  isBigIntKeyword: () => isBigIntKeyword,
  isBigIntLiteralType: () => isBigIntLiteralType,
  isBindingOrAssignmentElementRestIndicator: () => isBindingOrAssignmentElementRestIndicator,
  isBindingOrAssignmentElementTarget: () => isBindingOrAssignmentElementTarget,
  isBindingOrAssignmentPattern: () => isBindingOrAssignmentPattern,
  isBindingPattern: () => isBindingPattern,
  isBlockLike: () => isBlockLike,
  isBooleanKeyword: () => isBooleanKeyword,
  isBooleanLiteral: () => isBooleanLiteral,
  isBooleanLiteralType: () => isBooleanLiteralType,
  isClassLikeDeclaration: () => isClassLikeDeclaration,
  isClassMemberModifier: () => isClassMemberModifier,
  isColonToken: () => isColonToken,
  isCompilerOptionEnabled: () => isCompilerOptionEnabled,
  isConditionalType: () => isConditionalType,
  isConstAssertionExpression: () => isConstAssertionExpression,
  isConstKeyword: () => isConstKeyword,
  isDeclarationName: () => isDeclarationName,
  isDeclarationWithTypeParameterChildren: () => isDeclarationWithTypeParameterChildren,
  isDeclarationWithTypeParameters: () => isDeclarationWithTypeParameters,
  isDeclareKeyword: () => isDeclareKeyword,
  isDefaultKeyword: () => isDefaultKeyword,
  isDestructuringPattern: () => isDestructuringPattern,
  isDotToken: () => isDotToken,
  isEndOfFileToken: () => isEndOfFileToken,
  isEntityNameExpression: () => isEntityNameExpression,
  isEntityNameOrEntityNameExpression: () => isEntityNameOrEntityNameExpression,
  isEnumType: () => isEnumType,
  isEqualsGreaterThanToken: () => isEqualsGreaterThanToken,
  isEqualsToken: () => isEqualsToken,
  isEvolvingArrayType: () => isEvolvingArrayType,
  isExclamationToken: () => isExclamationToken,
  isExportKeyword: () => isExportKeyword,
  isFalseKeyword: () => isFalseKeyword,
  isFalseLiteral: () => isFalseLiteral,
  isFalseLiteralType: () => isFalseLiteralType,
  isFalsyType: () => isFalsyType,
  isForInOrOfStatement: () => isForInOrOfStatement,
  isFreshableIntrinsicType: () => isFreshableIntrinsicType,
  isFreshableType: () => isFreshableType,
  isFunctionLikeDeclaration: () => isFunctionLikeDeclaration,
  isFunctionScopeBoundary: () => isFunctionScopeBoundary,
  isImportExpression: () => isImportExpression,
  isImportKeyword: () => isImportKeyword,
  isInKeyword: () => isInKeyword,
  isIndexType: () => isIndexType,
  isIndexedAccessType: () => isIndexedAccessType,
  isInputFiles: () => isInputFiles,
  isInstantiableType: () => isInstantiableType,
  isIntersectionType: () => isIntersectionType,
  isIntrinsicAnyType: () => isIntrinsicAnyType,
  isIntrinsicBigIntType: () => isIntrinsicBigIntType,
  isIntrinsicBooleanType: () => isIntrinsicBooleanType,
  isIntrinsicESSymbolType: () => isIntrinsicESSymbolType,
  isIntrinsicErrorType: () => isIntrinsicErrorType,
  isIntrinsicNeverType: () => isIntrinsicNeverType,
  isIntrinsicNonPrimitiveType: () => isIntrinsicNonPrimitiveType,
  isIntrinsicNullType: () => isIntrinsicNullType,
  isIntrinsicNumberType: () => isIntrinsicNumberType,
  isIntrinsicStringType: () => isIntrinsicStringType,
  isIntrinsicType: () => isIntrinsicType,
  isIntrinsicUndefinedType: () => isIntrinsicUndefinedType,
  isIntrinsicUnknownType: () => isIntrinsicUnknownType,
  isIntrinsicVoidType: () => isIntrinsicVoidType,
  isIterationStatement: () => isIterationStatement,
  isJSDocComment: () => isJSDocComment,
  isJSDocNamespaceBody: () => isJSDocNamespaceBody,
  isJSDocNamespaceDeclaration: () => isJSDocNamespaceDeclaration,
  isJSDocText: () => isJSDocText,
  isJSDocTypeReferencingNode: () => isJSDocTypeReferencingNode,
  isJsonMinusNumericLiteral: () => isJsonMinusNumericLiteral,
  isJsonObjectExpression: () => isJsonObjectExpression,
  isJsxAttributeLike: () => isJsxAttributeLike,
  isJsxAttributeValue: () => isJsxAttributeValue,
  isJsxChild: () => isJsxChild,
  isJsxTagNameExpression: () => isJsxTagNameExpression,
  isJsxTagNamePropertyAccess: () => isJsxTagNamePropertyAccess,
  isLiteralToken: () => isLiteralToken,
  isLiteralType: () => isLiteralType,
  isModifierFlagSet: () => isModifierFlagSet,
  isModuleBody: () => isModuleBody,
  isModuleName: () => isModuleName,
  isModuleReference: () => isModuleReference,
  isNamedDeclarationWithName: () => isNamedDeclarationWithName,
  isNamedImportBindings: () => isNamedImportBindings,
  isNamedImportsOrExports: () => isNamedImportsOrExports,
  isNamespaceBody: () => isNamespaceBody,
  isNamespaceDeclaration: () => isNamespaceDeclaration,
  isNeverKeyword: () => isNeverKeyword,
  isNodeFlagSet: () => isNodeFlagSet,
  isNullKeyword: () => isNullKeyword,
  isNullLiteral: () => isNullLiteral,
  isNumberKeyword: () => isNumberKeyword,
  isNumberLiteralType: () => isNumberLiteralType,
  isNumericOrStringLikeLiteral: () => isNumericOrStringLikeLiteral,
  isNumericPropertyName: () => isNumericPropertyName,
  isObjectBindingOrAssignmentElement: () => isObjectBindingOrAssignmentElement,
  isObjectBindingOrAssignmentPattern: () => isObjectBindingOrAssignmentPattern,
  isObjectFlagSet: () => isObjectFlagSet,
  isObjectKeyword: () => isObjectKeyword,
  isObjectType: () => isObjectType,
  isObjectTypeDeclaration: () => isObjectTypeDeclaration,
  isOutKeyword: () => isOutKeyword,
  isOverrideKeyword: () => isOverrideKeyword,
  isParameterPropertyModifier: () => isParameterPropertyModifier,
  isPrivateKeyword: () => isPrivateKeyword,
  isPropertyAccessEntityNameExpression: () => isPropertyAccessEntityNameExpression,
  isPropertyNameLiteral: () => isPropertyNameLiteral,
  isPropertyReadonlyInType: () => isPropertyReadonlyInType,
  isProtectedKeyword: () => isProtectedKeyword,
  isPseudoLiteralToken: () => isPseudoLiteralToken,
  isPublicKeyword: () => isPublicKeyword,
  isQuestionDotToken: () => isQuestionDotToken,
  isQuestionToken: () => isQuestionToken,
  isReadonlyKeyword: () => isReadonlyKeyword,
  isSignatureDeclaration: () => isSignatureDeclaration,
  isStaticKeyword: () => isStaticKeyword,
  isStrictCompilerOptionEnabled: () => isStrictCompilerOptionEnabled,
  isStringKeyword: () => isStringKeyword,
  isStringLiteralType: () => isStringLiteralType,
  isStringMappingType: () => isStringMappingType,
  isSubstitutionType: () => isSubstitutionType,
  isSuperElementAccessExpression: () => isSuperElementAccessExpression,
  isSuperExpression: () => isSuperExpression,
  isSuperKeyword: () => isSuperKeyword,
  isSuperProperty: () => isSuperProperty,
  isSuperPropertyAccessExpression: () => isSuperPropertyAccessExpression,
  isSymbolFlagSet: () => isSymbolFlagSet,
  isSymbolKeyword: () => isSymbolKeyword,
  isSyntaxList: () => isSyntaxList,
  isTemplateLiteralType: () => isTemplateLiteralType,
  isThenableType: () => isThenableType,
  isThisExpression: () => isThisExpression,
  isThisKeyword: () => isThisKeyword,
  isTrueKeyword: () => isTrueKeyword,
  isTrueLiteral: () => isTrueLiteral,
  isTrueLiteralType: () => isTrueLiteralType,
  isTupleType: () => isTupleType,
  isTupleTypeReference: () => isTupleTypeReference,
  isTypeFlagSet: () => isTypeFlagSet,
  isTypeOnlyCompatibleAliasDeclaration: () => isTypeOnlyCompatibleAliasDeclaration,
  isTypeParameter: () => isTypeParameter,
  isTypeReference: () => isTypeReference,
  isTypeReferenceType: () => isTypeReferenceType,
  isTypeVariable: () => isTypeVariable,
  isUndefinedKeyword: () => isUndefinedKeyword,
  isUnionOrIntersectionType: () => isUnionOrIntersectionType,
  isUnionOrIntersectionTypeNode: () => isUnionOrIntersectionTypeNode,
  isUnionType: () => isUnionType,
  isUniqueESSymbolType: () => isUniqueESSymbolType,
  isUnknownKeyword: () => isUnknownKeyword,
  isUnknownLiteralType: () => isUnknownLiteralType,
  isUnparsedPrologue: () => isUnparsedPrologue,
  isUnparsedSourceText: () => isUnparsedSourceText,
  isUnparsedSyntheticReference: () => isUnparsedSyntheticReference,
  isValidPropertyAccess: () => isValidPropertyAccess,
  isVariableLikeDeclaration: () => isVariableLikeDeclaration,
  isVoidKeyword: () => isVoidKeyword,
  symbolHasReadonlyDeclaration: () => symbolHasReadonlyDeclaration,
  unionTypeParts: () => unionTypeParts
});
module.exports = __toCommonJS(src_exports);

// src/comments.ts
var import_typescript2 = __toESM(require("typescript"), 1);

// src/tokens.ts
var import_typescript = __toESM(require("typescript"), 1);
function forEachToken(node, callback, sourceFile = node.getSourceFile()) {
  const queue = [];
  while (true) {
    if (import_typescript.default.isTokenKind(node.kind)) {
      callback(node);
    } else if (
      // eslint-disable-next-line deprecation/deprecation -- need for support of TS < 4.7
      node.kind !== import_typescript.default.SyntaxKind.JSDocComment
    ) {
      const children = node.getChildren(sourceFile);
      if (children.length === 1) {
        node = children[0];
        continue;
      }
      for (let i = children.length - 1; i >= 0; --i)
        queue.push(children[i]);
    }
    if (queue.length === 0)
      break;
    node = queue.pop();
  }
}

// src/comments.ts
function canHaveTrailingTrivia(token) {
  switch (token.kind) {
    case import_typescript2.default.SyntaxKind.CloseBraceToken:
      return token.parent.kind !== import_typescript2.default.SyntaxKind.JsxExpression || !isJsxElementOrFragment(token.parent.parent);
    case import_typescript2.default.SyntaxKind.GreaterThanToken:
      switch (token.parent.kind) {
        case import_typescript2.default.SyntaxKind.JsxOpeningElement:
          return token.end !== token.parent.end;
        case import_typescript2.default.SyntaxKind.JsxOpeningFragment:
          return false;
        case import_typescript2.default.SyntaxKind.JsxSelfClosingElement:
          return token.end !== token.parent.end || // if end is not equal, this is part of the type arguments list
          !isJsxElementOrFragment(token.parent.parent);
        case import_typescript2.default.SyntaxKind.JsxClosingElement:
        case import_typescript2.default.SyntaxKind.JsxClosingFragment:
          return !isJsxElementOrFragment(token.parent.parent.parent);
      }
  }
  return true;
}
function isJsxElementOrFragment(node) {
  return node.kind === import_typescript2.default.SyntaxKind.JsxElement || node.kind === import_typescript2.default.SyntaxKind.JsxFragment;
}
function forEachComment(node, callback, sourceFile = node.getSourceFile()) {
  const fullText = sourceFile.text;
  const notJsx = sourceFile.languageVariant !== import_typescript2.default.LanguageVariant.JSX;
  return forEachToken(
    node,
    (token) => {
      if (token.pos === token.end)
        return;
      if (token.kind !== import_typescript2.default.SyntaxKind.JsxText)
        import_typescript2.default.forEachLeadingCommentRange(
          fullText,
          // skip shebang at position 0
          token.pos === 0 ? (import_typescript2.default.getShebang(fullText) ?? "").length : token.pos,
          commentCallback
        );
      if (notJsx || canHaveTrailingTrivia(token))
        return import_typescript2.default.forEachTrailingCommentRange(
          fullText,
          token.end,
          commentCallback
        );
    },
    sourceFile
  );
  function commentCallback(pos, end, kind) {
    callback(fullText, { pos, end, kind });
  }
}

// src/compilerOptions.ts
var import_typescript3 = __toESM(require("typescript"), 1);
function isCompilerOptionEnabled(options, option) {
  switch (option) {
    case "stripInternal":
    case "declarationMap":
    case "emitDeclarationOnly":
      return options[option] === true && isCompilerOptionEnabled(options, "declaration");
    case "declaration":
      return options.declaration || isCompilerOptionEnabled(options, "composite");
    case "incremental":
      return options.incremental === void 0 ? isCompilerOptionEnabled(options, "composite") : options.incremental;
    case "skipDefaultLibCheck":
      return options.skipDefaultLibCheck || isCompilerOptionEnabled(options, "skipLibCheck");
    case "suppressImplicitAnyIndexErrors":
      return options.suppressImplicitAnyIndexErrors === true && isCompilerOptionEnabled(options, "noImplicitAny");
    case "allowSyntheticDefaultImports":
      return options.allowSyntheticDefaultImports !== void 0 ? options.allowSyntheticDefaultImports : isCompilerOptionEnabled(options, "esModuleInterop") || options.module === import_typescript3.default.ModuleKind.System;
    case "noUncheckedIndexedAccess":
      return options.noUncheckedIndexedAccess === true && isCompilerOptionEnabled(options, "strictNullChecks");
    case "allowJs":
      return options.allowJs === void 0 ? isCompilerOptionEnabled(options, "checkJs") : options.allowJs;
    case "noImplicitAny":
    case "noImplicitThis":
    case "strictNullChecks":
    case "strictFunctionTypes":
    case "strictPropertyInitialization":
    case "alwaysStrict":
    case "strictBindCallApply":
      return isStrictCompilerOptionEnabled(
        options,
        option
      );
  }
  return options[option] === true;
}
function isStrictCompilerOptionEnabled(options, option) {
  return (options.strict ? options[option] !== false : options[option] === true) && (option !== "strictPropertyInitialization" || isStrictCompilerOptionEnabled(options, "strictNullChecks"));
}

// src/flags.ts
var import_typescript4 = __toESM(require("typescript"), 1);
function isFlagSet(allFlags, flag) {
  return (allFlags & flag) !== 0;
}
function isFlagSetOnObject(obj, flag) {
  return isFlagSet(obj.flags, flag);
}
function isModifierFlagSet(node, flag) {
  return isFlagSet(import_typescript4.default.getCombinedModifierFlags(node), flag);
}
var isNodeFlagSet = isFlagSetOnObject;
function isObjectFlagSet(objectType, flag) {
  return isFlagSet(objectType.objectFlags, flag);
}
var isSymbolFlagSet = isFlagSetOnObject;
var isTypeFlagSet = isFlagSetOnObject;

// src/modifiers.ts
function includesModifier(modifiers, ...kinds) {
  if (modifiers === void 0)
    return false;
  for (const modifier of modifiers)
    if (kinds.includes(modifier.kind))
      return true;
  return false;
}

// src/nodes/typeGuards/compound.ts
var import_typescript8 = __toESM(require("typescript"), 1);

// src/nodes/typeGuards/single.ts
var import_typescript5 = __toESM(require("typescript"), 1);
function isAbstractKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.AbstractKeyword;
}
function isAccessorKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.AccessorKeyword;
}
function isAnyKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.AnyKeyword;
}
function isAssertKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.AssertKeyword;
}
function isAssertsKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.AssertsKeyword;
}
function isAsyncKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.AsyncKeyword;
}
function isAwaitKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.AwaitKeyword;
}
function isBigIntKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.BigIntKeyword;
}
function isBooleanKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.BooleanKeyword;
}
function isColonToken(node) {
  return node.kind === import_typescript5.default.SyntaxKind.ColonToken;
}
function isConstKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.ConstKeyword;
}
function isDeclareKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.DeclareKeyword;
}
function isDefaultKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.DefaultKeyword;
}
function isDotToken(node) {
  return node.kind === import_typescript5.default.SyntaxKind.DotToken;
}
function isEndOfFileToken(node) {
  return node.kind === import_typescript5.default.SyntaxKind.EndOfFileToken;
}
function isEqualsGreaterThanToken(node) {
  return node.kind === import_typescript5.default.SyntaxKind.EqualsGreaterThanToken;
}
function isEqualsToken(node) {
  return node.kind === import_typescript5.default.SyntaxKind.EqualsToken;
}
function isExclamationToken(node) {
  return node.kind === import_typescript5.default.SyntaxKind.ExclamationToken;
}
function isExportKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.ExportKeyword;
}
function isFalseKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.FalseKeyword;
}
function isFalseLiteral(node) {
  return node.kind === import_typescript5.default.SyntaxKind.FalseKeyword;
}
function isImportExpression(node) {
  return node.kind === import_typescript5.default.SyntaxKind.ImportKeyword;
}
function isImportKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.ImportKeyword;
}
function isInKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.InKeyword;
}
function isInputFiles(node) {
  return node.kind === import_typescript5.default.SyntaxKind.InputFiles;
}
function isJSDocText(node) {
  return node.kind === import_typescript5.default.SyntaxKind.JSDocText;
}
function isJsonMinusNumericLiteral(node) {
  return node.kind === import_typescript5.default.SyntaxKind.PrefixUnaryExpression;
}
function isNeverKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.NeverKeyword;
}
function isNullKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.NullKeyword;
}
function isNullLiteral(node) {
  return node.kind === import_typescript5.default.SyntaxKind.NullKeyword;
}
function isNumberKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.NumberKeyword;
}
function isObjectKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.ObjectKeyword;
}
function isOutKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.OutKeyword;
}
function isOverrideKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.OverrideKeyword;
}
function isPrivateKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.PrivateKeyword;
}
function isProtectedKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.ProtectedKeyword;
}
function isPublicKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.PublicKeyword;
}
function isQuestionDotToken(node) {
  return node.kind === import_typescript5.default.SyntaxKind.QuestionDotToken;
}
function isQuestionToken(node) {
  return node.kind === import_typescript5.default.SyntaxKind.QuestionToken;
}
function isReadonlyKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.ReadonlyKeyword;
}
function isStaticKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.StaticKeyword;
}
function isStringKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.StringKeyword;
}
function isSuperExpression(node) {
  return node.kind === import_typescript5.default.SyntaxKind.SuperKeyword;
}
function isSuperKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.SuperKeyword;
}
function isSymbolKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.SymbolKeyword;
}
function isSyntaxList(node) {
  return node.kind === import_typescript5.default.SyntaxKind.SyntaxList;
}
function isThisExpression(node) {
  return node.kind === import_typescript5.default.SyntaxKind.ThisKeyword;
}
function isThisKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.ThisKeyword;
}
function isTrueKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.TrueKeyword;
}
function isTrueLiteral(node) {
  return node.kind === import_typescript5.default.SyntaxKind.TrueKeyword;
}
function isUndefinedKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.UndefinedKeyword;
}
function isUnknownKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.UnknownKeyword;
}
function isUnparsedPrologue(node) {
  return node.kind === import_typescript5.default.SyntaxKind.UnparsedPrologue;
}
function isUnparsedSyntheticReference(node) {
  return node.kind === import_typescript5.default.SyntaxKind.UnparsedSyntheticReference;
}
function isVoidKeyword(node) {
  return node.kind === import_typescript5.default.SyntaxKind.VoidKeyword;
}

// src/nodes/typeGuards/union.ts
var import_typescript7 = __toESM(require("typescript"), 1);

// src/utils.ts
var import_typescript6 = __toESM(require("typescript"), 1);
var [tsMajor, tsMinor] = import_typescript6.default.versionMajorMinor.split(".").map((raw) => Number.parseInt(raw, 10));
function isTsVersionAtLeast(major, minor = 0) {
  return tsMajor > major || tsMajor === major && tsMinor >= minor;
}

// src/nodes/typeGuards/union.ts
function isAccessExpression(node) {
  return import_typescript7.default.isPropertyAccessExpression(node) || import_typescript7.default.isElementAccessExpression(node);
}
function isAccessibilityModifier(node) {
  return isPublicKeyword(node) || isPrivateKeyword(node) || isProtectedKeyword(node);
}
function isAccessorDeclaration(node) {
  return import_typescript7.default.isGetAccessorDeclaration(node) || import_typescript7.default.isSetAccessorDeclaration(node);
}
function isArrayBindingElement(node) {
  return import_typescript7.default.isBindingElement(node) || import_typescript7.default.isOmittedExpression(node);
}
function isArrayBindingOrAssignmentPattern(node) {
  return import_typescript7.default.isArrayBindingPattern(node) || import_typescript7.default.isArrayLiteralExpression(node);
}
function isAssignmentPattern(node) {
  return import_typescript7.default.isObjectLiteralExpression(node) || import_typescript7.default.isArrayLiteralExpression(node);
}
function isBindingOrAssignmentElementRestIndicator(node) {
  if (import_typescript7.default.isSpreadElement(node) || import_typescript7.default.isSpreadAssignment(node)) {
    return true;
  }
  if (isTsVersionAtLeast(4, 4)) {
    return import_typescript7.default.isDotDotDotToken(node);
  }
  return false;
}
function isBindingOrAssignmentElementTarget(node) {
  return isBindingOrAssignmentPattern(node) || import_typescript7.default.isIdentifier(node) || import_typescript7.default.isPropertyAccessExpression(node) || import_typescript7.default.isElementAccessExpression(node) || import_typescript7.default.isOmittedExpression(node);
}
function isBindingOrAssignmentPattern(node) {
  return isObjectBindingOrAssignmentPattern(node) || isArrayBindingOrAssignmentPattern(node);
}
function isBindingPattern(node) {
  return import_typescript7.default.isObjectBindingPattern(node) || import_typescript7.default.isArrayBindingPattern(node);
}
function isBlockLike(node) {
  return import_typescript7.default.isSourceFile(node) || import_typescript7.default.isBlock(node) || import_typescript7.default.isModuleBlock(node) || import_typescript7.default.isCaseOrDefaultClause(node);
}
function isBooleanLiteral(node) {
  return isTrueLiteral(node) || isFalseLiteral(node);
}
function isClassLikeDeclaration(node) {
  return import_typescript7.default.isClassDeclaration(node) || import_typescript7.default.isClassExpression(node);
}
function isClassMemberModifier(node) {
  return isAccessibilityModifier(node) || isReadonlyKeyword(node) || isStaticKeyword(node) || isAccessorKeyword(node);
}
function isDeclarationName(node) {
  return import_typescript7.default.isIdentifier(node) || import_typescript7.default.isPrivateIdentifier(node) || import_typescript7.default.isStringLiteralLike(node) || import_typescript7.default.isNumericLiteral(node) || import_typescript7.default.isComputedPropertyName(node) || import_typescript7.default.isElementAccessExpression(node) || isBindingPattern(node) || isEntityNameExpression(node);
}
function isDeclarationWithTypeParameterChildren(node) {
  return isSignatureDeclaration(node) || // eslint-disable-next-line deprecation/deprecation -- Keep compatibility with ts <5
  isClassLikeDeclaration(node) || import_typescript7.default.isInterfaceDeclaration(node) || import_typescript7.default.isTypeAliasDeclaration(node) || import_typescript7.default.isJSDocTemplateTag(node);
}
function isDeclarationWithTypeParameters(node) {
  return isDeclarationWithTypeParameterChildren(node) || import_typescript7.default.isJSDocTypedefTag(node) || import_typescript7.default.isJSDocCallbackTag(node) || import_typescript7.default.isJSDocSignature(node);
}
function isDestructuringPattern(node) {
  return isBindingPattern(node) || import_typescript7.default.isObjectLiteralExpression(node) || import_typescript7.default.isArrayLiteralExpression(node);
}
function isEntityNameExpression(node) {
  return import_typescript7.default.isIdentifier(node) || isPropertyAccessEntityNameExpression(node);
}
function isEntityNameOrEntityNameExpression(node) {
  return import_typescript7.default.isEntityName(node) || isEntityNameExpression(node);
}
function isForInOrOfStatement(node) {
  return import_typescript7.default.isForInStatement(node) || import_typescript7.default.isForOfStatement(node);
}
function isFunctionLikeDeclaration(node) {
  return import_typescript7.default.isFunctionDeclaration(node) || import_typescript7.default.isMethodDeclaration(node) || import_typescript7.default.isGetAccessorDeclaration(node) || import_typescript7.default.isSetAccessorDeclaration(node) || import_typescript7.default.isConstructorDeclaration(node) || import_typescript7.default.isFunctionExpression(node) || import_typescript7.default.isArrowFunction(node);
}
function hasDecorators(node) {
  return import_typescript7.default.isParameter(node) || import_typescript7.default.isPropertyDeclaration(node) || import_typescript7.default.isMethodDeclaration(node) || import_typescript7.default.isGetAccessorDeclaration(node) || import_typescript7.default.isSetAccessorDeclaration(node) || import_typescript7.default.isClassExpression(node) || import_typescript7.default.isClassDeclaration(node);
}
function hasExpressionInitializer(node) {
  return import_typescript7.default.isVariableDeclaration(node) || import_typescript7.default.isParameter(node) || import_typescript7.default.isBindingElement(node) || import_typescript7.default.isPropertyDeclaration(node) || import_typescript7.default.isPropertyAssignment(node) || import_typescript7.default.isEnumMember(node);
}
function hasInitializer(node) {
  return hasExpressionInitializer(node) || import_typescript7.default.isForStatement(node) || import_typescript7.default.isForInStatement(node) || import_typescript7.default.isForOfStatement(node) || import_typescript7.default.isJsxAttribute(node);
}
function hasJSDoc(node) {
  if (
    // eslint-disable-next-line deprecation/deprecation -- Keep compatibility with ts <5
    isAccessorDeclaration(node) || import_typescript7.default.isArrowFunction(node) || import_typescript7.default.isBlock(node) || import_typescript7.default.isBreakStatement(node) || import_typescript7.default.isCallSignatureDeclaration(node) || import_typescript7.default.isCaseClause(node) || // eslint-disable-next-line deprecation/deprecation -- Keep compatibility with ts <5
    isClassLikeDeclaration(node) || import_typescript7.default.isConstructorDeclaration(node) || import_typescript7.default.isConstructorTypeNode(node) || import_typescript7.default.isConstructSignatureDeclaration(node) || import_typescript7.default.isContinueStatement(node) || import_typescript7.default.isDebuggerStatement(node) || import_typescript7.default.isDoStatement(node) || import_typescript7.default.isEmptyStatement(node) || isEndOfFileToken(node) || import_typescript7.default.isEnumDeclaration(node) || import_typescript7.default.isEnumMember(node) || import_typescript7.default.isExportAssignment(node) || import_typescript7.default.isExportDeclaration(node) || import_typescript7.default.isExportSpecifier(node) || import_typescript7.default.isExpressionStatement(node) || import_typescript7.default.isForInStatement(node) || import_typescript7.default.isForOfStatement(node) || import_typescript7.default.isForStatement(node) || import_typescript7.default.isFunctionDeclaration(node) || import_typescript7.default.isFunctionExpression(node) || import_typescript7.default.isFunctionTypeNode(node) || import_typescript7.default.isIfStatement(node) || import_typescript7.default.isImportDeclaration(node) || import_typescript7.default.isImportEqualsDeclaration(node) || import_typescript7.default.isIndexSignatureDeclaration(node) || import_typescript7.default.isInterfaceDeclaration(node) || import_typescript7.default.isJSDocFunctionType(node) || import_typescript7.default.isLabeledStatement(node) || import_typescript7.default.isMethodDeclaration(node) || import_typescript7.default.isMethodSignature(node) || import_typescript7.default.isModuleDeclaration(node) || import_typescript7.default.isNamedTupleMember(node) || import_typescript7.default.isNamespaceExportDeclaration(node) || import_typescript7.default.isParameter(node) || import_typescript7.default.isParenthesizedExpression(node) || import_typescript7.default.isPropertyAssignment(node) || import_typescript7.default.isPropertyDeclaration(node) || import_typescript7.default.isPropertySignature(node) || import_typescript7.default.isReturnStatement(node) || import_typescript7.default.isShorthandPropertyAssignment(node) || import_typescript7.default.isSpreadAssignment(node) || import_typescript7.default.isSwitchStatement(node) || import_typescript7.default.isThrowStatement(node) || import_typescript7.default.isTryStatement(node) || import_typescript7.default.isTypeAliasDeclaration(node) || import_typescript7.default.isVariableDeclaration(node) || import_typescript7.default.isVariableStatement(node) || import_typescript7.default.isWhileStatement(node) || import_typescript7.default.isWithStatement(node)
  ) {
    return true;
  }
  if (isTsVersionAtLeast(4, 4) && import_typescript7.default.isClassStaticBlockDeclaration(node)) {
    return true;
  }
  if (isTsVersionAtLeast(5, 0) && (import_typescript7.default.isBinaryExpression(node) || import_typescript7.default.isElementAccessExpression(node) || import_typescript7.default.isIdentifier(node) || import_typescript7.default.isJSDocSignature(node) || import_typescript7.default.isObjectLiteralExpression(node) || import_typescript7.default.isPropertyAccessExpression(node) || import_typescript7.default.isTypeParameterDeclaration(node))) {
    return true;
  }
  return false;
}
function hasModifiers(node) {
  return import_typescript7.default.isTypeParameterDeclaration(node) || import_typescript7.default.isParameter(node) || import_typescript7.default.isConstructorTypeNode(node) || import_typescript7.default.isPropertySignature(node) || import_typescript7.default.isPropertyDeclaration(node) || import_typescript7.default.isMethodSignature(node) || import_typescript7.default.isMethodDeclaration(node) || import_typescript7.default.isConstructorDeclaration(node) || import_typescript7.default.isGetAccessorDeclaration(node) || import_typescript7.default.isSetAccessorDeclaration(node) || import_typescript7.default.isIndexSignatureDeclaration(node) || import_typescript7.default.isFunctionExpression(node) || import_typescript7.default.isArrowFunction(node) || import_typescript7.default.isClassExpression(node) || import_typescript7.default.isVariableStatement(node) || import_typescript7.default.isFunctionDeclaration(node) || import_typescript7.default.isClassDeclaration(node) || import_typescript7.default.isInterfaceDeclaration(node) || import_typescript7.default.isTypeAliasDeclaration(node) || import_typescript7.default.isEnumDeclaration(node) || import_typescript7.default.isModuleDeclaration(node) || import_typescript7.default.isImportEqualsDeclaration(node) || import_typescript7.default.isImportDeclaration(node) || import_typescript7.default.isExportAssignment(node) || import_typescript7.default.isExportDeclaration(node);
}
function hasType(node) {
  return isSignatureDeclaration(node) || import_typescript7.default.isVariableDeclaration(node) || import_typescript7.default.isParameter(node) || import_typescript7.default.isPropertySignature(node) || import_typescript7.default.isPropertyDeclaration(node) || import_typescript7.default.isTypePredicateNode(node) || import_typescript7.default.isParenthesizedTypeNode(node) || import_typescript7.default.isTypeOperatorNode(node) || import_typescript7.default.isMappedTypeNode(node) || import_typescript7.default.isAssertionExpression(node) || import_typescript7.default.isTypeAliasDeclaration(node) || import_typescript7.default.isJSDocTypeExpression(node) || import_typescript7.default.isJSDocNonNullableType(node) || import_typescript7.default.isJSDocNullableType(node) || import_typescript7.default.isJSDocOptionalType(node) || import_typescript7.default.isJSDocVariadicType(node);
}
function hasTypeArguments(node) {
  return import_typescript7.default.isCallExpression(node) || import_typescript7.default.isNewExpression(node) || import_typescript7.default.isTaggedTemplateExpression(node) || import_typescript7.default.isJsxOpeningElement(node) || import_typescript7.default.isJsxSelfClosingElement(node);
}
function isJSDocComment(node) {
  if (isJSDocText(node)) {
    return true;
  }
  if (isTsVersionAtLeast(4, 4)) {
    return import_typescript7.default.isJSDocLink(node) || import_typescript7.default.isJSDocLinkCode(node) || import_typescript7.default.isJSDocLinkPlain(node);
  }
  return false;
}
function isJSDocNamespaceBody(node) {
  return import_typescript7.default.isIdentifier(node) || isJSDocNamespaceDeclaration(node);
}
function isJSDocTypeReferencingNode(node) {
  return import_typescript7.default.isJSDocVariadicType(node) || import_typescript7.default.isJSDocOptionalType(node) || import_typescript7.default.isJSDocNullableType(node) || import_typescript7.default.isJSDocNonNullableType(node);
}
function isJsonObjectExpression(node) {
  return import_typescript7.default.isObjectLiteralExpression(node) || import_typescript7.default.isArrayLiteralExpression(node) || isJsonMinusNumericLiteral(node) || import_typescript7.default.isNumericLiteral(node) || import_typescript7.default.isStringLiteral(node) || isBooleanLiteral(node) || isNullLiteral(node);
}
function isJsxAttributeLike(node) {
  return import_typescript7.default.isJsxAttribute(node) || import_typescript7.default.isJsxSpreadAttribute(node);
}
function isJsxAttributeValue(node) {
  return import_typescript7.default.isStringLiteral(node) || import_typescript7.default.isJsxExpression(node) || import_typescript7.default.isJsxElement(node) || import_typescript7.default.isJsxSelfClosingElement(node) || import_typescript7.default.isJsxFragment(node);
}
function isJsxChild(node) {
  return import_typescript7.default.isJsxText(node) || import_typescript7.default.isJsxExpression(node) || import_typescript7.default.isJsxElement(node) || import_typescript7.default.isJsxSelfClosingElement(node) || import_typescript7.default.isJsxFragment(node);
}
function isJsxTagNameExpression(node) {
  return import_typescript7.default.isIdentifier(node) || isThisExpression(node) || isJsxTagNamePropertyAccess(node);
}
function isLiteralToken(node) {
  return import_typescript7.default.isNumericLiteral(node) || import_typescript7.default.isBigIntLiteral(node) || import_typescript7.default.isStringLiteral(node) || import_typescript7.default.isJsxText(node) || import_typescript7.default.isRegularExpressionLiteral(node) || import_typescript7.default.isNoSubstitutionTemplateLiteral(node);
}
function isModuleBody(node) {
  return isNamespaceBody(node) || isJSDocNamespaceBody(node);
}
function isModuleName(node) {
  return import_typescript7.default.isIdentifier(node) || import_typescript7.default.isStringLiteral(node);
}
function isModuleReference(node) {
  return import_typescript7.default.isEntityName(node) || import_typescript7.default.isExternalModuleReference(node);
}
function isNamedImportBindings(node) {
  return import_typescript7.default.isNamespaceImport(node) || import_typescript7.default.isNamedImports(node);
}
function isNamedImportsOrExports(node) {
  return import_typescript7.default.isNamedImports(node) || import_typescript7.default.isNamedExports(node);
}
function isNamespaceBody(node) {
  return import_typescript7.default.isModuleBlock(node) || isNamespaceDeclaration(node);
}
function isObjectBindingOrAssignmentElement(node) {
  return import_typescript7.default.isBindingElement(node) || import_typescript7.default.isPropertyAssignment(node) || import_typescript7.default.isShorthandPropertyAssignment(node) || import_typescript7.default.isSpreadAssignment(node);
}
function isObjectBindingOrAssignmentPattern(node) {
  return import_typescript7.default.isObjectBindingPattern(node) || import_typescript7.default.isObjectLiteralExpression(node);
}
function isObjectTypeDeclaration(node) {
  return (
    // eslint-disable-next-line deprecation/deprecation -- Keep compatibility with ts <5
    isClassLikeDeclaration(node) || import_typescript7.default.isInterfaceDeclaration(node) || import_typescript7.default.isTypeLiteralNode(node)
  );
}
function isParameterPropertyModifier(node) {
  return isAccessibilityModifier(node) || isReadonlyKeyword(node);
}
function isPropertyNameLiteral(node) {
  return import_typescript7.default.isIdentifier(node) || import_typescript7.default.isStringLiteralLike(node) || import_typescript7.default.isNumericLiteral(node);
}
function isPseudoLiteralToken(node) {
  return import_typescript7.default.isTemplateHead(node) || import_typescript7.default.isTemplateMiddle(node) || import_typescript7.default.isTemplateTail(node);
}
function isSignatureDeclaration(node) {
  return import_typescript7.default.isCallSignatureDeclaration(node) || import_typescript7.default.isConstructSignatureDeclaration(node) || import_typescript7.default.isMethodSignature(node) || import_typescript7.default.isIndexSignatureDeclaration(node) || import_typescript7.default.isFunctionTypeNode(node) || import_typescript7.default.isConstructorTypeNode(node) || import_typescript7.default.isJSDocFunctionType(node) || import_typescript7.default.isFunctionDeclaration(node) || import_typescript7.default.isMethodDeclaration(node) || import_typescript7.default.isConstructorDeclaration(node) || // eslint-disable-next-line deprecation/deprecation -- Keep compatibility with ts <5
  isAccessorDeclaration(node) || import_typescript7.default.isFunctionExpression(node) || import_typescript7.default.isArrowFunction(node);
}
function isSuperProperty(node) {
  return isSuperPropertyAccessExpression(node) || isSuperElementAccessExpression(node);
}
function isTypeOnlyCompatibleAliasDeclaration(node) {
  if (import_typescript7.default.isImportClause(node) || import_typescript7.default.isImportEqualsDeclaration(node) || import_typescript7.default.isNamespaceImport(node) || import_typescript7.default.isImportOrExportSpecifier(node)) {
    return true;
  }
  if (isTsVersionAtLeast(5, 0) && (import_typescript7.default.isExportDeclaration(node) || import_typescript7.default.isNamespaceExport(node))) {
    return true;
  }
  return false;
}
function isTypeReferenceType(node) {
  return import_typescript7.default.isTypeReferenceNode(node) || import_typescript7.default.isExpressionWithTypeArguments(node);
}
function isUnionOrIntersectionTypeNode(node) {
  return import_typescript7.default.isUnionTypeNode(node) || import_typescript7.default.isIntersectionTypeNode(node);
}
function isUnparsedSourceText(node) {
  return import_typescript7.default.isUnparsedPrepend(node) || import_typescript7.default.isUnparsedTextLike(node);
}
function isVariableLikeDeclaration(node) {
  return import_typescript7.default.isVariableDeclaration(node) || import_typescript7.default.isParameter(node) || import_typescript7.default.isBindingElement(node) || import_typescript7.default.isPropertyDeclaration(node) || import_typescript7.default.isPropertyAssignment(node) || import_typescript7.default.isPropertySignature(node) || import_typescript7.default.isJsxAttribute(node) || import_typescript7.default.isShorthandPropertyAssignment(node) || import_typescript7.default.isEnumMember(node) || import_typescript7.default.isJSDocPropertyTag(node) || import_typescript7.default.isJSDocParameterTag(node);
}

// src/nodes/typeGuards/compound.ts
function isConstAssertionExpression(node) {
  return import_typescript8.default.isTypeReferenceNode(node.type) && import_typescript8.default.isIdentifier(node.type.typeName) && node.type.typeName.escapedText === "const";
}
function isIterationStatement(node) {
  switch (node.kind) {
    case import_typescript8.default.SyntaxKind.DoStatement:
    case import_typescript8.default.SyntaxKind.ForInStatement:
    case import_typescript8.default.SyntaxKind.ForOfStatement:
    case import_typescript8.default.SyntaxKind.ForStatement:
    case import_typescript8.default.SyntaxKind.WhileStatement:
      return true;
    default:
      return false;
  }
}
function isJSDocNamespaceDeclaration(node) {
  return import_typescript8.default.isModuleDeclaration(node) && import_typescript8.default.isIdentifier(node.name) && (node.body === void 0 || isJSDocNamespaceBody(node.body));
}
function isJsxTagNamePropertyAccess(node) {
  return import_typescript8.default.isPropertyAccessExpression(node) && // eslint-disable-next-line deprecation/deprecation -- Keep compatibility with ts < 5
  isJsxTagNameExpression(node.expression);
}
function isNamedDeclarationWithName(node) {
  return "name" in node && node.name !== void 0 && node.name !== null && isDeclarationName(node.name);
}
function isNamespaceDeclaration(node) {
  return import_typescript8.default.isModuleDeclaration(node) && import_typescript8.default.isIdentifier(node.name) && node.body !== void 0 && isNamespaceBody(node.body);
}
function isNumericOrStringLikeLiteral(node) {
  switch (node.kind) {
    case import_typescript8.default.SyntaxKind.StringLiteral:
    case import_typescript8.default.SyntaxKind.NumericLiteral:
    case import_typescript8.default.SyntaxKind.NoSubstitutionTemplateLiteral:
      return true;
    default:
      return false;
  }
}
function isPropertyAccessEntityNameExpression(node) {
  return import_typescript8.default.isPropertyAccessExpression(node) && import_typescript8.default.isIdentifier(node.name) && isEntityNameExpression(node.expression);
}
function isSuperElementAccessExpression(node) {
  return import_typescript8.default.isElementAccessExpression(node) && isSuperExpression(node.expression);
}
function isSuperPropertyAccessExpression(node) {
  return import_typescript8.default.isPropertyAccessExpression(node) && isSuperExpression(node.expression);
}

// src/scopes.ts
var import_typescript9 = __toESM(require("typescript"), 1);
function isFunctionScopeBoundary(node) {
  switch (node.kind) {
    case import_typescript9.default.SyntaxKind.FunctionExpression:
    case import_typescript9.default.SyntaxKind.ArrowFunction:
    case import_typescript9.default.SyntaxKind.Constructor:
    case import_typescript9.default.SyntaxKind.ModuleDeclaration:
    case import_typescript9.default.SyntaxKind.ClassDeclaration:
    case import_typescript9.default.SyntaxKind.ClassExpression:
    case import_typescript9.default.SyntaxKind.EnumDeclaration:
    case import_typescript9.default.SyntaxKind.MethodDeclaration:
    case import_typescript9.default.SyntaxKind.FunctionDeclaration:
    case import_typescript9.default.SyntaxKind.GetAccessor:
    case import_typescript9.default.SyntaxKind.SetAccessor:
    case import_typescript9.default.SyntaxKind.MethodSignature:
    case import_typescript9.default.SyntaxKind.CallSignature:
    case import_typescript9.default.SyntaxKind.ConstructSignature:
    case import_typescript9.default.SyntaxKind.ConstructorType:
    case import_typescript9.default.SyntaxKind.FunctionType:
      return true;
    case import_typescript9.default.SyntaxKind.SourceFile:
      return import_typescript9.default.isExternalModule(node);
    default:
      return false;
  }
}

// src/syntax.ts
var import_typescript10 = __toESM(require("typescript"), 1);
function isAssignmentKind(kind) {
  return kind >= import_typescript10.default.SyntaxKind.FirstAssignment && kind <= import_typescript10.default.SyntaxKind.LastAssignment;
}
function isNumericPropertyName(name) {
  return String(+name) === name;
}
function charSize(ch) {
  return ch >= 65536 ? 2 : 1;
}
function isValidPropertyAccess(text, languageVersion = import_typescript10.default.ScriptTarget.Latest) {
  if (text.length === 0)
    return false;
  let ch = text.codePointAt(0);
  if (!import_typescript10.default.isIdentifierStart(ch, languageVersion))
    return false;
  for (let i = charSize(ch); i < text.length; i += charSize(ch)) {
    ch = text.codePointAt(i);
    if (!import_typescript10.default.isIdentifierPart(ch, languageVersion))
      return false;
  }
  return true;
}

// src/types/getters.ts
var import_typescript15 = __toESM(require("typescript"), 1);

// src/types/typeGuards/intrinsic.ts
var import_typescript11 = __toESM(require("typescript"), 1);
function isIntrinsicAnyType(type) {
  return isTypeFlagSet(type, import_typescript11.default.TypeFlags.Any);
}
function isIntrinsicBooleanType(type) {
  return isTypeFlagSet(type, import_typescript11.default.TypeFlags.Boolean);
}
function isIntrinsicBigIntType(type) {
  return isTypeFlagSet(type, import_typescript11.default.TypeFlags.BigInt);
}
function isIntrinsicErrorType(type) {
  return isIntrinsicType(type) && type.intrinsicName === "error";
}
function isIntrinsicESSymbolType(type) {
  return isTypeFlagSet(type, import_typescript11.default.TypeFlags.ESSymbol);
}
var IntrinsicTypeFlags = import_typescript11.default.TypeFlags.Intrinsic ?? import_typescript11.default.TypeFlags.Any | import_typescript11.default.TypeFlags.Unknown | import_typescript11.default.TypeFlags.String | import_typescript11.default.TypeFlags.Number | import_typescript11.default.TypeFlags.BigInt | import_typescript11.default.TypeFlags.Boolean | import_typescript11.default.TypeFlags.BooleanLiteral | import_typescript11.default.TypeFlags.ESSymbol | import_typescript11.default.TypeFlags.Void | import_typescript11.default.TypeFlags.Undefined | import_typescript11.default.TypeFlags.Null | import_typescript11.default.TypeFlags.Never | import_typescript11.default.TypeFlags.NonPrimitive;
function isIntrinsicType(type) {
  return isTypeFlagSet(type, IntrinsicTypeFlags);
}
function isIntrinsicNeverType(type) {
  return isTypeFlagSet(type, import_typescript11.default.TypeFlags.Never);
}
function isIntrinsicNonPrimitiveType(type) {
  return isTypeFlagSet(type, import_typescript11.default.TypeFlags.NonPrimitive);
}
function isIntrinsicNullType(type) {
  return isTypeFlagSet(type, import_typescript11.default.TypeFlags.Null);
}
function isIntrinsicNumberType(type) {
  return isTypeFlagSet(type, import_typescript11.default.TypeFlags.Number);
}
function isIntrinsicStringType(type) {
  return isTypeFlagSet(type, import_typescript11.default.TypeFlags.String);
}
function isIntrinsicUndefinedType(type) {
  return isTypeFlagSet(type, import_typescript11.default.TypeFlags.Undefined);
}
function isIntrinsicUnknownType(type) {
  return isTypeFlagSet(type, import_typescript11.default.TypeFlags.Unknown);
}
function isIntrinsicVoidType(type) {
  return isTypeFlagSet(type, import_typescript11.default.TypeFlags.Void);
}

// src/types/typeGuards/objects.ts
var import_typescript13 = __toESM(require("typescript"), 1);

// src/types/typeGuards/single.ts
var import_typescript12 = __toESM(require("typescript"), 1);
function isConditionalType(type) {
  return isTypeFlagSet(type, import_typescript12.default.TypeFlags.Conditional);
}
function isEnumType(type) {
  return isTypeFlagSet(type, import_typescript12.default.TypeFlags.Enum);
}
function isFreshableType(type) {
  return isTypeFlagSet(type, import_typescript12.default.TypeFlags.Freshable);
}
function isIndexType(type) {
  return isTypeFlagSet(type, import_typescript12.default.TypeFlags.Index);
}
function isIndexedAccessType(type) {
  return isTypeFlagSet(type, import_typescript12.default.TypeFlags.IndexedAccess);
}
function isInstantiableType(type) {
  return isTypeFlagSet(type, import_typescript12.default.TypeFlags.Instantiable);
}
function isIntersectionType(type) {
  return isTypeFlagSet(type, import_typescript12.default.TypeFlags.Intersection);
}
function isObjectType(type) {
  return isTypeFlagSet(type, import_typescript12.default.TypeFlags.Object);
}
function isStringMappingType(type) {
  return isTypeFlagSet(type, import_typescript12.default.TypeFlags.StringMapping);
}
function isSubstitutionType(type) {
  return isTypeFlagSet(type, import_typescript12.default.TypeFlags.Substitution);
}
function isTypeParameter(type) {
  return isTypeFlagSet(type, import_typescript12.default.TypeFlags.TypeParameter);
}
function isTypeVariable(type) {
  return isTypeFlagSet(type, import_typescript12.default.TypeFlags.TypeVariable);
}
function isUnionType(type) {
  return isTypeFlagSet(type, import_typescript12.default.TypeFlags.Union);
}
function isUnionOrIntersectionType(type) {
  return isTypeFlagSet(type, import_typescript12.default.TypeFlags.UnionOrIntersection);
}
function isUniqueESSymbolType(type) {
  return isTypeFlagSet(type, import_typescript12.default.TypeFlags.UniqueESSymbol);
}

// src/types/typeGuards/objects.ts
function isEvolvingArrayType(type) {
  return isObjectType(type) && isObjectFlagSet(type, import_typescript13.default.ObjectFlags.EvolvingArray);
}
function isTupleType(type) {
  return isObjectType(type) && isObjectFlagSet(type, import_typescript13.default.ObjectFlags.Tuple);
}
function isTypeReference(type) {
  return isObjectType(type) && isObjectFlagSet(type, import_typescript13.default.ObjectFlags.Reference);
}

// src/types/typeGuards/compound.ts
function isFreshableIntrinsicType(type) {
  return isIntrinsicType(type) && isFreshableType(type);
}
function isTupleTypeReference(type) {
  return isTypeReference(type) && isTupleType(type.target);
}

// src/types/typeGuards/literal.ts
var import_typescript14 = __toESM(require("typescript"), 1);
function isBooleanLiteralType(type) {
  return isTypeFlagSet(type, import_typescript14.default.TypeFlags.BooleanLiteral);
}
function isBigIntLiteralType(type) {
  return isTypeFlagSet(type, import_typescript14.default.TypeFlags.BigIntLiteral);
}
function isFalseLiteralType(type) {
  return isBooleanLiteralType(type) && type.intrinsicName === "false";
}
function isLiteralType(type) {
  return isTypeFlagSet(type, import_typescript14.default.TypeFlags.Literal);
}
function isNumberLiteralType(type) {
  return isTypeFlagSet(type, import_typescript14.default.TypeFlags.NumberLiteral);
}
function isStringLiteralType(type) {
  return isTypeFlagSet(type, import_typescript14.default.TypeFlags.StringLiteral);
}
function isTemplateLiteralType(type) {
  return isTypeFlagSet(type, import_typescript14.default.TypeFlags.TemplateLiteral);
}
function isTrueLiteralType(type) {
  return isBooleanLiteralType(type) && type.intrinsicName === "true";
}
function isUnknownLiteralType(type) {
  return isTypeFlagSet(type, import_typescript14.default.TypeFlags.Literal);
}

// src/types/getters.ts
function getCallSignaturesOfType(type) {
  if (isUnionType(type)) {
    const signatures = [];
    for (const subType of type.types) {
      signatures.push(...getCallSignaturesOfType(subType));
    }
    return signatures;
  }
  if (isIntersectionType(type)) {
    let signatures;
    for (const subType of type.types) {
      const sig = getCallSignaturesOfType(subType);
      if (sig.length !== 0) {
        if (signatures !== void 0)
          return [];
        signatures = sig;
      }
    }
    return signatures === void 0 ? [] : signatures;
  }
  return type.getCallSignatures();
}
function getPropertyOfType(type, name) {
  if (!name.startsWith("__"))
    return type.getProperty(name);
  return type.getProperties().find((s) => s.escapedName === name);
}
function getWellKnownSymbolPropertyOfType(type, wellKnownSymbolName, typeChecker) {
  const prefix = "__@" + wellKnownSymbolName;
  for (const prop of type.getProperties()) {
    if (!prop.name.startsWith(prefix)) {
      continue;
    }
    const declaration = prop.valueDeclaration ?? prop.getDeclarations()[0];
    if (!isNamedDeclarationWithName(declaration) || declaration.name === void 0 || !import_typescript15.default.isComputedPropertyName(declaration.name)) {
      continue;
    }
    const globalSymbol = typeChecker.getApparentType(
      typeChecker.getTypeAtLocation(declaration.name.expression)
    ).symbol;
    if (prop.escapedName === getPropertyNameOfWellKnownSymbol(
      typeChecker,
      globalSymbol,
      wellKnownSymbolName
    )) {
      return prop;
    }
  }
  return void 0;
}
function getPropertyNameOfWellKnownSymbol(typeChecker, symbolConstructor, symbolName) {
  const knownSymbol = symbolConstructor && typeChecker.getTypeOfSymbolAtLocation(
    symbolConstructor,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    symbolConstructor.valueDeclaration
  ).getProperty(symbolName);
  const knownSymbolType = knownSymbol && typeChecker.getTypeOfSymbolAtLocation(
    knownSymbol,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    knownSymbol.valueDeclaration
  );
  if (knownSymbolType && isUniqueESSymbolType(knownSymbolType))
    return knownSymbolType.escapedName;
  return "__@" + symbolName;
}

// src/types/utilities.ts
var import_typescript17 = __toESM(require("typescript"), 1);

// src/nodes/utilities.ts
var import_typescript16 = __toESM(require("typescript"), 1);
function isBindableObjectDefinePropertyCall(node) {
  return node.arguments.length === 3 && isEntityNameExpression(node.arguments[0]) && isNumericOrStringLikeLiteral(node.arguments[1]) && import_typescript16.default.isPropertyAccessExpression(node.expression) && node.expression.name.escapedText === "defineProperty" && import_typescript16.default.isIdentifier(node.expression.expression) && node.expression.expression.escapedText === "Object";
}
function isInConstContext(node) {
  let current = node;
  while (true) {
    const parent = current.parent;
    outer:
      switch (parent.kind) {
        case import_typescript16.default.SyntaxKind.TypeAssertionExpression:
        case import_typescript16.default.SyntaxKind.AsExpression:
          return isConstAssertionExpression(parent);
        case import_typescript16.default.SyntaxKind.PrefixUnaryExpression:
          if (current.kind !== import_typescript16.default.SyntaxKind.NumericLiteral)
            return false;
          switch (parent.operator) {
            case import_typescript16.default.SyntaxKind.PlusToken:
            case import_typescript16.default.SyntaxKind.MinusToken:
              current = parent;
              break outer;
            default:
              return false;
          }
        case import_typescript16.default.SyntaxKind.PropertyAssignment:
          if (parent.initializer !== current)
            return false;
          current = parent.parent;
          break;
        case import_typescript16.default.SyntaxKind.ShorthandPropertyAssignment:
          current = parent.parent;
          break;
        case import_typescript16.default.SyntaxKind.ParenthesizedExpression:
        case import_typescript16.default.SyntaxKind.ArrayLiteralExpression:
        case import_typescript16.default.SyntaxKind.ObjectLiteralExpression:
        case import_typescript16.default.SyntaxKind.TemplateExpression:
          current = parent;
          break;
        default:
          return false;
      }
  }
}

// src/types/utilities.ts
function isFalsyType(type) {
  if (isTypeFlagSet(
    type,
    import_typescript17.default.TypeFlags.Undefined | import_typescript17.default.TypeFlags.Null | import_typescript17.default.TypeFlags.Void
  ))
    return true;
  if (type.isLiteral())
    return !type.value;
  return isFalseLiteralType(type);
}
function intersectionTypeParts(type) {
  return isIntersectionType(type) ? type.types : [type];
}
function isReadonlyPropertyIntersection(type, name, typeChecker) {
  const typeParts = isIntersectionType(type) ? type.types : [type];
  return typeParts.some((subType) => {
    const prop = getPropertyOfType(subType, name);
    if (prop === void 0)
      return false;
    if (prop.flags & import_typescript17.default.SymbolFlags.Transient) {
      if (/^(?:[1-9]\d*|0)$/.test(name) && isTupleTypeReference(subType))
        return subType.target.readonly;
      switch (isReadonlyPropertyFromMappedType(subType, name, typeChecker)) {
        case true:
          return true;
        case false:
          return false;
        default:
      }
    }
    return !!// members of namespace import
    (isSymbolFlagSet(prop, import_typescript17.default.SymbolFlags.ValueModule) || // we unwrapped every mapped type, now we can check the actual declarations
    symbolHasReadonlyDeclaration(prop, typeChecker));
  });
}
function isReadonlyPropertyFromMappedType(type, name, typeChecker) {
  if (!isObjectType(type) || !isObjectFlagSet(type, import_typescript17.default.ObjectFlags.Mapped))
    return;
  const declaration = type.symbol.declarations[0];
  if (declaration.readonlyToken !== void 0 && !/^__@[^@]+$/.test(name))
    return declaration.readonlyToken.kind !== import_typescript17.default.SyntaxKind.MinusToken;
  const { modifiersType } = type;
  return modifiersType && isPropertyReadonlyInType(modifiersType, name, typeChecker);
}
function isCallback(typeChecker, param, node) {
  let type = typeChecker.getApparentType(
    typeChecker.getTypeOfSymbolAtLocation(param, node)
  );
  if (param.valueDeclaration.dotDotDotToken) {
    type = type.getNumberIndexType();
    if (type === void 0)
      return false;
  }
  for (const subType of unionTypeParts(type)) {
    if (subType.getCallSignatures().length !== 0)
      return true;
  }
  return false;
}
function isPropertyReadonlyInType(type, name, typeChecker) {
  let seenProperty = false;
  let seenReadonlySignature = false;
  for (const subType of unionTypeParts(type)) {
    if (getPropertyOfType(subType, name) === void 0) {
      const index = (isNumericPropertyName(name) ? typeChecker.getIndexInfoOfType(subType, import_typescript17.default.IndexKind.Number) : void 0) ?? typeChecker.getIndexInfoOfType(subType, import_typescript17.default.IndexKind.String);
      if (index?.isReadonly) {
        if (seenProperty)
          return true;
        seenReadonlySignature = true;
      }
    } else if (seenReadonlySignature || isReadonlyPropertyIntersection(subType, name, typeChecker)) {
      return true;
    } else {
      seenProperty = true;
    }
  }
  return false;
}
function isReadonlyAssignmentDeclaration(node, typeChecker) {
  if (!isBindableObjectDefinePropertyCall(node))
    return false;
  const descriptorType = typeChecker.getTypeAtLocation(node.arguments[2]);
  if (descriptorType.getProperty("value") === void 0)
    return descriptorType.getProperty("set") === void 0;
  const writableProp = descriptorType.getProperty("writable");
  if (writableProp === void 0)
    return false;
  const writableType = writableProp.valueDeclaration !== void 0 && import_typescript17.default.isPropertyAssignment(writableProp.valueDeclaration) ? typeChecker.getTypeAtLocation(writableProp.valueDeclaration.initializer) : typeChecker.getTypeOfSymbolAtLocation(writableProp, node.arguments[2]);
  return isFalseLiteralType(writableType);
}
function isThenableType(typeChecker, node, type = typeChecker.getTypeAtLocation(node)) {
  for (const typePart of unionTypeParts(typeChecker.getApparentType(type))) {
    const then = typePart.getProperty("then");
    if (then === void 0)
      continue;
    const thenType = typeChecker.getTypeOfSymbolAtLocation(then, node);
    for (const subTypePart of unionTypeParts(thenType))
      for (const signature of subTypePart.getCallSignatures())
        if (signature.parameters.length !== 0 && isCallback(typeChecker, signature.parameters[0], node))
          return true;
  }
  return false;
}
function symbolHasReadonlyDeclaration(symbol, typeChecker) {
  return !!((symbol.flags & import_typescript17.default.SymbolFlags.Accessor) === import_typescript17.default.SymbolFlags.GetAccessor || symbol.declarations?.some(
    (node) => isModifierFlagSet(node, import_typescript17.default.ModifierFlags.Readonly) || import_typescript17.default.isVariableDeclaration(node) && isNodeFlagSet(node.parent, import_typescript17.default.NodeFlags.Const) || import_typescript17.default.isCallExpression(node) && isReadonlyAssignmentDeclaration(node, typeChecker) || import_typescript17.default.isEnumMember(node) || (import_typescript17.default.isPropertyAssignment(node) || import_typescript17.default.isShorthandPropertyAssignment(node)) && isInConstContext(node.parent)
  ));
}
function unionTypeParts(type) {
  return isUnionType(type) ? type.types : [type];
}

// src/usage/UsageWalker.ts
var import_typescript23 = __toESM(require("typescript"), 1);

// src/usage/declarations.ts
var import_typescript19 = __toESM(require("typescript"), 1);

// src/usage/utils.ts
var import_typescript18 = __toESM(require("typescript"), 1);
function identifierToKeywordKind(node) {
  return "identifierToKeywordKind" in import_typescript18.default ? import_typescript18.default.identifierToKeywordKind(node) : (
    // eslint-disable-next-line deprecation/deprecation
    node.originalKeywordKind
  );
}
function canHaveDecorators(node) {
  return "canHaveDecorators" in import_typescript18.default ? import_typescript18.default.canHaveDecorators(node) : "decorators" in node;
}
function getDecorators(node) {
  return "getDecorators" in import_typescript18.default ? import_typescript18.default.getDecorators(node) : node.decorators;
}

// src/usage/declarations.ts
var DeclarationDomain = /* @__PURE__ */ ((DeclarationDomain2) => {
  DeclarationDomain2[DeclarationDomain2["Namespace"] = 1] = "Namespace";
  DeclarationDomain2[DeclarationDomain2["Type"] = 2] = "Type";
  DeclarationDomain2[DeclarationDomain2["Value"] = 4] = "Value";
  DeclarationDomain2[DeclarationDomain2["Import"] = 8] = "Import";
  DeclarationDomain2[DeclarationDomain2["Any"] = 7] = "Any";
  return DeclarationDomain2;
})(DeclarationDomain || {});
function getDeclarationDomain(node) {
  switch (node.parent.kind) {
    case import_typescript19.default.SyntaxKind.TypeParameter:
    case import_typescript19.default.SyntaxKind.InterfaceDeclaration:
    case import_typescript19.default.SyntaxKind.TypeAliasDeclaration:
      return 2 /* Type */;
    case import_typescript19.default.SyntaxKind.ClassDeclaration:
    case import_typescript19.default.SyntaxKind.ClassExpression:
      return 2 /* Type */ | 4 /* Value */;
    case import_typescript19.default.SyntaxKind.EnumDeclaration:
      return 7 /* Any */;
    case import_typescript19.default.SyntaxKind.NamespaceImport:
    case import_typescript19.default.SyntaxKind.ImportClause:
      return 7 /* Any */ | 8 /* Import */;
    case import_typescript19.default.SyntaxKind.ImportEqualsDeclaration:
    case import_typescript19.default.SyntaxKind.ImportSpecifier:
      return node.parent.name === node ? 7 /* Any */ | 8 /* Import */ : void 0;
    case import_typescript19.default.SyntaxKind.ModuleDeclaration:
      return 1 /* Namespace */;
    case import_typescript19.default.SyntaxKind.Parameter:
      if (node.parent.parent.kind === import_typescript19.default.SyntaxKind.IndexSignature || identifierToKeywordKind(node) === import_typescript19.default.SyntaxKind.ThisKeyword)
        return;
    case import_typescript19.default.SyntaxKind.BindingElement:
    case import_typescript19.default.SyntaxKind.VariableDeclaration:
      return node.parent.name === node ? 4 /* Value */ : void 0;
    case import_typescript19.default.SyntaxKind.FunctionDeclaration:
    case import_typescript19.default.SyntaxKind.FunctionExpression:
      return 4 /* Value */;
  }
}

// src/usage/getPropertyName.ts
var import_typescript20 = __toESM(require("typescript"), 1);
function unwrapParentheses(node) {
  while (node.kind === import_typescript20.default.SyntaxKind.ParenthesizedExpression)
    node = node.expression;
  return node;
}
function getPropertyName(propertyName) {
  if (propertyName.kind === import_typescript20.default.SyntaxKind.ComputedPropertyName) {
    const expression = unwrapParentheses(propertyName.expression);
    if (import_typescript20.default.isPrefixUnaryExpression(expression)) {
      let negate = false;
      switch (expression.operator) {
        case import_typescript20.default.SyntaxKind.MinusToken:
          negate = true;
        case import_typescript20.default.SyntaxKind.PlusToken:
          return import_typescript20.default.isNumericLiteral(expression.operand) ? `${negate ? "-" : ""}${expression.operand.text}` : import_typescript20.default.isBigIntLiteral(expression.operand) ? `${negate ? "-" : ""}${expression.operand.text.slice(0, -1)}` : void 0;
        default:
          return;
      }
    }
    if (import_typescript20.default.isBigIntLiteral(expression))
      return expression.text.slice(0, -1);
    if (isNumericOrStringLikeLiteral(expression))
      return expression.text;
    return;
  }
  return propertyName.kind === import_typescript20.default.SyntaxKind.PrivateIdentifier ? void 0 : propertyName.text;
}

// src/usage/getUsageDomain.ts
var import_typescript21 = __toESM(require("typescript"), 1);
var UsageDomain = /* @__PURE__ */ ((UsageDomain2) => {
  UsageDomain2[UsageDomain2["Namespace"] = 1] = "Namespace";
  UsageDomain2[UsageDomain2["Type"] = 2] = "Type";
  UsageDomain2[UsageDomain2["Value"] = 4] = "Value";
  UsageDomain2[UsageDomain2["ValueOrNamespace"] = 5] = "ValueOrNamespace";
  UsageDomain2[UsageDomain2["Any"] = 7] = "Any";
  UsageDomain2[UsageDomain2["TypeQuery"] = 8] = "TypeQuery";
  return UsageDomain2;
})(UsageDomain || {});
function getUsageDomain(node) {
  const parent = node.parent;
  switch (parent.kind) {
    case import_typescript21.default.SyntaxKind.TypeReference:
      return identifierToKeywordKind(node) !== import_typescript21.default.SyntaxKind.ConstKeyword ? 2 /* Type */ : void 0;
    case import_typescript21.default.SyntaxKind.ExpressionWithTypeArguments:
      return parent.parent.token === import_typescript21.default.SyntaxKind.ImplementsKeyword || parent.parent.parent.kind === import_typescript21.default.SyntaxKind.InterfaceDeclaration ? 2 /* Type */ : 4 /* Value */;
    case import_typescript21.default.SyntaxKind.TypeQuery:
      return 5 /* ValueOrNamespace */ | 8 /* TypeQuery */;
    case import_typescript21.default.SyntaxKind.QualifiedName:
      if (parent.left === node) {
        if (getEntityNameParent(parent).kind === import_typescript21.default.SyntaxKind.TypeQuery)
          return 1 /* Namespace */ | 8 /* TypeQuery */;
        return 1 /* Namespace */;
      }
      break;
    case import_typescript21.default.SyntaxKind.ExportSpecifier:
      if (parent.propertyName === void 0 || parent.propertyName === node)
        return 7 /* Any */;
      break;
    case import_typescript21.default.SyntaxKind.ExportAssignment:
      return 7 /* Any */;
    case import_typescript21.default.SyntaxKind.BindingElement:
      if (parent.initializer === node)
        return 5 /* ValueOrNamespace */;
      break;
    case import_typescript21.default.SyntaxKind.Parameter:
    case import_typescript21.default.SyntaxKind.EnumMember:
    case import_typescript21.default.SyntaxKind.PropertyDeclaration:
    case import_typescript21.default.SyntaxKind.VariableDeclaration:
    case import_typescript21.default.SyntaxKind.PropertyAssignment:
    case import_typescript21.default.SyntaxKind.PropertyAccessExpression:
    case import_typescript21.default.SyntaxKind.ImportEqualsDeclaration:
      if (parent.name !== node)
        return 5 /* ValueOrNamespace */;
      break;
    case import_typescript21.default.SyntaxKind.JsxAttribute:
    case import_typescript21.default.SyntaxKind.FunctionDeclaration:
    case import_typescript21.default.SyntaxKind.FunctionExpression:
    case import_typescript21.default.SyntaxKind.NamespaceImport:
    case import_typescript21.default.SyntaxKind.ClassDeclaration:
    case import_typescript21.default.SyntaxKind.ClassExpression:
    case import_typescript21.default.SyntaxKind.ModuleDeclaration:
    case import_typescript21.default.SyntaxKind.MethodDeclaration:
    case import_typescript21.default.SyntaxKind.EnumDeclaration:
    case import_typescript21.default.SyntaxKind.GetAccessor:
    case import_typescript21.default.SyntaxKind.SetAccessor:
    case import_typescript21.default.SyntaxKind.LabeledStatement:
    case import_typescript21.default.SyntaxKind.BreakStatement:
    case import_typescript21.default.SyntaxKind.ContinueStatement:
    case import_typescript21.default.SyntaxKind.ImportClause:
    case import_typescript21.default.SyntaxKind.ImportSpecifier:
    case import_typescript21.default.SyntaxKind.TypePredicate:
    case import_typescript21.default.SyntaxKind.MethodSignature:
    case import_typescript21.default.SyntaxKind.PropertySignature:
    case import_typescript21.default.SyntaxKind.NamespaceExportDeclaration:
    case import_typescript21.default.SyntaxKind.NamespaceExport:
    case import_typescript21.default.SyntaxKind.InterfaceDeclaration:
    case import_typescript21.default.SyntaxKind.TypeAliasDeclaration:
    case import_typescript21.default.SyntaxKind.TypeParameter:
    case import_typescript21.default.SyntaxKind.NamedTupleMember:
      break;
    default:
      return 5 /* ValueOrNamespace */;
  }
}
function getEntityNameParent(name) {
  let parent = name.parent;
  while (parent.kind === import_typescript21.default.SyntaxKind.QualifiedName)
    parent = parent.parent;
  return parent;
}

// src/usage/Scope.ts
var import_typescript22 = __toESM(require("typescript"), 1);
function isBlockScopeBoundary(node) {
  switch (node.kind) {
    case import_typescript22.default.SyntaxKind.Block: {
      const parent = node.parent;
      return parent.kind !== import_typescript22.default.SyntaxKind.CatchClause && // blocks inside SourceFile are block scope boundaries
      (parent.kind === import_typescript22.default.SyntaxKind.SourceFile || // blocks that are direct children of a function scope boundary are no scope boundary
      // for example the FunctionBlock is part of the function scope of the containing function
      !isFunctionScopeBoundary(parent)) ? 2 /* Block */ : 0 /* None */;
    }
    case import_typescript22.default.SyntaxKind.ForStatement:
    case import_typescript22.default.SyntaxKind.ForInStatement:
    case import_typescript22.default.SyntaxKind.ForOfStatement:
    case import_typescript22.default.SyntaxKind.CaseBlock:
    case import_typescript22.default.SyntaxKind.CatchClause:
    case import_typescript22.default.SyntaxKind.WithStatement:
      return 2 /* Block */;
    default:
      return 0 /* None */;
  }
}

// src/usage/scopes.ts
var _enumScopes;
var AbstractScope = class {
  constructor(global) {
    this.global = global;
    this.variables = /* @__PURE__ */ new Map();
    this.uses = [];
    this.namespaceScopes = void 0;
    __privateAdd(this, _enumScopes, void 0);
  }
  addVariable(identifier, name, selector, exported, domain) {
    const variables = this.getDestinationScope(selector).getVariables();
    const declaration = {
      domain,
      exported,
      declaration: name
    };
    const variable = variables.get(identifier);
    if (variable === void 0) {
      variables.set(identifier, {
        domain,
        declarations: [declaration],
        uses: []
      });
    } else {
      variable.domain |= domain;
      variable.declarations.push(declaration);
    }
  }
  addUse(use) {
    this.uses.push(use);
  }
  getVariables() {
    return this.variables;
  }
  getFunctionScope() {
    return this;
  }
  end(cb) {
    if (this.namespaceScopes !== void 0) {
      this.namespaceScopes.forEach((value) => value.finish(cb));
    }
    this.namespaceScopes = __privateSet(this, _enumScopes, void 0);
    this.applyUses();
    this.variables.forEach((variable) => {
      for (const declaration of variable.declarations) {
        const result = {
          declarations: [],
          domain: declaration.domain,
          exported: declaration.exported,
          inGlobalScope: this.global,
          uses: []
        };
        for (const other of variable.declarations)
          if (other.domain & declaration.domain)
            result.declarations.push(other.declaration);
        for (const use of variable.uses)
          if (use.domain & declaration.domain)
            result.uses.push(use);
        cb(result, declaration.declaration, this);
      }
    });
  }
  // tslint:disable-next-line:prefer-function-over-method
  markExported(_name2) {
  }
  // only relevant for the root scope
  createOrReuseNamespaceScope(name, _exported, ambient, hasExportStatement) {
    let scope;
    if (this.namespaceScopes === void 0) {
      this.namespaceScopes = /* @__PURE__ */ new Map();
    } else {
      scope = this.namespaceScopes.get(name);
    }
    if (scope === void 0) {
      scope = new NamespaceScope(ambient, hasExportStatement, this);
      this.namespaceScopes.set(name, scope);
    } else {
      scope.refresh(ambient, hasExportStatement);
    }
    return scope;
  }
  createOrReuseEnumScope(name, _exported) {
    let scope;
    if (__privateGet(this, _enumScopes) === void 0) {
      __privateSet(this, _enumScopes, /* @__PURE__ */ new Map());
    } else {
      scope = __privateGet(this, _enumScopes).get(name);
    }
    if (scope === void 0) {
      scope = new EnumScope(this);
      __privateGet(this, _enumScopes).set(name, scope);
    }
    return scope;
  }
  applyUses() {
    for (const use of this.uses) {
      if (!this.applyUse(use)) {
        this.addUseToParent(use);
      }
    }
    this.uses = [];
  }
  applyUse(use, variables = this.variables) {
    const variable = variables.get(use.location.text);
    if (variable === void 0 || (variable.domain & use.domain) === 0)
      return false;
    variable.uses.push(use);
    return true;
  }
  addUseToParent(_use) {
  }
};
_enumScopes = new WeakMap();
var NonRootScope = class extends AbstractScope {
  constructor(parent, boundary) {
    super(false);
    this.parent = parent;
    this.boundary = boundary;
  }
  getDestinationScope(selector) {
    return this.boundary & selector ? this : this.parent.getDestinationScope(selector);
  }
  addUseToParent(use) {
    return this.parent.addUse(use, this);
  }
};
var EnumScope = class extends NonRootScope {
  constructor(parent) {
    super(parent, 1 /* Function */);
  }
  end() {
    this.applyUses();
  }
};
var _exportAll, _exports, _innerScope;
var RootScope = class extends AbstractScope {
  constructor(exportAll, global) {
    super(global);
    __privateAdd(this, _exportAll, void 0);
    __privateAdd(this, _exports, void 0);
    __privateAdd(this, _innerScope, new NonRootScope(this, 1 /* Function */));
    __privateSet(this, _exportAll, exportAll);
  }
  addVariable(identifier, name, selector, exported, domain) {
    if (domain & 8 /* Import */)
      return super.addVariable(identifier, name, selector, exported, domain);
    return __privateGet(this, _innerScope).addVariable(
      identifier,
      name,
      selector,
      exported,
      domain
    );
  }
  addUse(use, origin) {
    if (origin === __privateGet(this, _innerScope))
      return super.addUse(use);
    return __privateGet(this, _innerScope).addUse(use);
  }
  markExported(id) {
    if (__privateGet(this, _exports) === void 0) {
      __privateSet(this, _exports, [id.text]);
    } else {
      __privateGet(this, _exports).push(id.text);
    }
  }
  end(cb) {
    __privateGet(this, _innerScope).end((value, key) => {
      value.exported = value.exported || __privateGet(this, _exportAll) || __privateGet(this, _exports) !== void 0 && __privateGet(this, _exports).includes(key.text);
      value.inGlobalScope = this.global;
      return cb(value, key, this);
    });
    return super.end((value, key, scope) => {
      value.exported = value.exported || scope === this && __privateGet(this, _exports) !== void 0 && __privateGet(this, _exports).includes(key.text);
      return cb(value, key, scope);
    });
  }
  getDestinationScope() {
    return this;
  }
};
_exportAll = new WeakMap();
_exports = new WeakMap();
_innerScope = new WeakMap();
var _innerScope2, _exports2, _ambient, _hasExport;
var NamespaceScope = class extends NonRootScope {
  constructor(ambient, hasExport, parent) {
    super(parent, 1 /* Function */);
    __privateAdd(this, _innerScope2, new NonRootScope(this, 1 /* Function */));
    __privateAdd(this, _exports2, void 0);
    __privateAdd(this, _ambient, void 0);
    __privateAdd(this, _hasExport, void 0);
    __privateSet(this, _ambient, ambient);
    __privateSet(this, _hasExport, hasExport);
  }
  finish(cb) {
    return super.end(cb);
  }
  end(cb) {
    __privateGet(this, _innerScope2).end((variable, key, scope) => {
      if (scope !== __privateGet(this, _innerScope2) || !variable.exported && (!__privateGet(this, _ambient) || __privateGet(this, _exports2) !== void 0 && !__privateGet(this, _exports2).has(key.text)))
        return cb(variable, key, scope);
      const namespaceVar = this.variables.get(key.text);
      if (namespaceVar === void 0) {
        this.variables.set(key.text, {
          declarations: variable.declarations.map(mapDeclaration),
          domain: variable.domain,
          uses: [...variable.uses]
        });
      } else {
        outer:
          for (const declaration of variable.declarations) {
            for (const existing of namespaceVar.declarations)
              if (existing.declaration === declaration)
                continue outer;
            namespaceVar.declarations.push(mapDeclaration(declaration));
          }
        namespaceVar.domain |= variable.domain;
        for (const use of variable.uses) {
          if (namespaceVar.uses.includes(use))
            continue;
          namespaceVar.uses.push(use);
        }
      }
    });
    this.applyUses();
    __privateSet(this, _innerScope2, new NonRootScope(this, 1 /* Function */));
  }
  createOrReuseNamespaceScope(name, exported, ambient, hasExportStatement) {
    if (!exported && (!__privateGet(this, _ambient) || __privateGet(this, _hasExport)))
      return __privateGet(this, _innerScope2).createOrReuseNamespaceScope(
        name,
        exported,
        ambient || __privateGet(this, _ambient),
        hasExportStatement
      );
    return super.createOrReuseNamespaceScope(
      name,
      exported,
      ambient || __privateGet(this, _ambient),
      hasExportStatement
    );
  }
  createOrReuseEnumScope(name, exported) {
    if (!exported && (!__privateGet(this, _ambient) || __privateGet(this, _hasExport)))
      return __privateGet(this, _innerScope2).createOrReuseEnumScope(name, exported);
    return super.createOrReuseEnumScope(name, exported);
  }
  addUse(use, source) {
    if (source !== __privateGet(this, _innerScope2))
      return __privateGet(this, _innerScope2).addUse(use);
    this.uses.push(use);
  }
  refresh(ambient, hasExport) {
    __privateSet(this, _ambient, ambient);
    __privateSet(this, _hasExport, hasExport);
  }
  markExported(name) {
    if (__privateGet(this, _exports2) === void 0)
      __privateSet(this, _exports2, /* @__PURE__ */ new Set());
    __privateGet(this, _exports2).add(name.text);
  }
  getDestinationScope() {
    return __privateGet(this, _innerScope2);
  }
};
_innerScope2 = new WeakMap();
_exports2 = new WeakMap();
_ambient = new WeakMap();
_hasExport = new WeakMap();
function mapDeclaration(declaration) {
  return {
    declaration,
    exported: true,
    domain: getDeclarationDomain(declaration)
  };
}
var FunctionScope = class extends NonRootScope {
  constructor(parent) {
    super(parent, 1 /* Function */);
  }
  beginBody() {
    this.applyUses();
  }
};
var _name, _domain;
var AbstractNamedExpressionScope = class extends NonRootScope {
  constructor(name, domain, parent) {
    super(parent, 1 /* Function */);
    __privateAdd(this, _name, void 0);
    __privateAdd(this, _domain, void 0);
    __privateSet(this, _name, name);
    __privateSet(this, _domain, domain);
  }
  end(cb) {
    this.innerScope.end(cb);
    return cb(
      {
        declarations: [__privateGet(this, _name)],
        domain: __privateGet(this, _domain),
        exported: false,
        uses: this.uses,
        inGlobalScope: false
      },
      __privateGet(this, _name),
      this
    );
  }
  addUse(use, source) {
    if (source !== this.innerScope)
      return this.innerScope.addUse(use);
    if (use.domain & __privateGet(this, _domain) && use.location.text === __privateGet(this, _name).text) {
      this.uses.push(use);
    } else {
      return this.parent.addUse(use, this);
    }
  }
  getFunctionScope() {
    return this.innerScope;
  }
  getDestinationScope() {
    return this.innerScope;
  }
};
_name = new WeakMap();
_domain = new WeakMap();
var FunctionExpressionScope = class extends AbstractNamedExpressionScope {
  constructor(name, parent) {
    super(name, 4 /* Value */, parent);
    this.innerScope = new FunctionScope(this);
  }
  beginBody() {
    return this.innerScope.beginBody();
  }
};
var _functionScope;
var BlockScope = class extends NonRootScope {
  constructor(functionScope, parent) {
    super(parent, 2 /* Block */);
    __privateAdd(this, _functionScope, void 0);
    __privateSet(this, _functionScope, functionScope);
  }
  getFunctionScope() {
    return __privateGet(this, _functionScope);
  }
};
_functionScope = new WeakMap();
var ClassExpressionScope = class extends AbstractNamedExpressionScope {
  constructor(name, parent) {
    super(name, 4 /* Value */ | 2 /* Type */, parent);
    this.innerScope = new NonRootScope(this, 1 /* Function */);
  }
};
var _state;
var ConditionalTypeScope = class extends NonRootScope {
  constructor(parent) {
    super(parent, 8 /* ConditionalType */);
    __privateAdd(this, _state, 0 /* Initial */);
  }
  updateState(newState) {
    __privateSet(this, _state, newState);
  }
  addUse(use) {
    if (__privateGet(this, _state) === 2 /* TrueType */)
      return void this.uses.push(use);
    return this.parent.addUse(use, this);
  }
};
_state = new WeakMap();

// src/usage/UsageWalker.ts
var _result, _scope, _handleConditionalType, handleConditionalType_fn, _handleFunctionLikeDeclaration, handleFunctionLikeDeclaration_fn, _handleModule, handleModule_fn, _handleDeclaration, handleDeclaration_fn, _handleBindingName, handleBindingName_fn, _handleVariableDeclaration, handleVariableDeclaration_fn;
var UsageWalker = class {
  constructor() {
    __privateAdd(this, _handleConditionalType);
    __privateAdd(this, _handleFunctionLikeDeclaration);
    __privateAdd(this, _handleModule);
    __privateAdd(this, _handleDeclaration);
    __privateAdd(this, _handleBindingName);
    __privateAdd(this, _handleVariableDeclaration);
    __privateAdd(this, _result, /* @__PURE__ */ new Map());
    __privateAdd(this, _scope, void 0);
  }
  getUsage(sourceFile) {
    const variableCallback = (variable, key) => {
      __privateGet(this, _result).set(key, variable);
    };
    const isModule = import_typescript23.default.isExternalModule(sourceFile);
    __privateSet(this, _scope, new RootScope(
      sourceFile.isDeclarationFile && isModule && !containsExportStatement(sourceFile),
      !isModule
    ));
    const cb = (node) => {
      if (isBlockScopeBoundary(node))
        return continueWithScope(
          node,
          new BlockScope(__privateGet(this, _scope).getFunctionScope(), __privateGet(this, _scope)),
          handleBlockScope
        );
      switch (node.kind) {
        case import_typescript23.default.SyntaxKind.ClassExpression:
          return continueWithScope(
            node,
            node.name !== void 0 ? new ClassExpressionScope(
              node.name,
              __privateGet(this, _scope)
            ) : new NonRootScope(__privateGet(this, _scope), 1 /* Function */)
          );
        case import_typescript23.default.SyntaxKind.ClassDeclaration:
          __privateMethod(this, _handleDeclaration, handleDeclaration_fn).call(this, node, true, 4 /* Value */ | 2 /* Type */);
          return continueWithScope(
            node,
            new NonRootScope(__privateGet(this, _scope), 1 /* Function */)
          );
        case import_typescript23.default.SyntaxKind.InterfaceDeclaration:
        case import_typescript23.default.SyntaxKind.TypeAliasDeclaration:
          __privateMethod(this, _handleDeclaration, handleDeclaration_fn).call(this, node, true, 2 /* Type */);
          return continueWithScope(
            node,
            new NonRootScope(__privateGet(this, _scope), 4 /* Type */)
          );
        case import_typescript23.default.SyntaxKind.EnumDeclaration:
          __privateMethod(this, _handleDeclaration, handleDeclaration_fn).call(this, node, true, 7 /* Any */);
          return continueWithScope(
            node,
            __privateGet(this, _scope).createOrReuseEnumScope(
              node.name.text,
              includesModifier(
                node.modifiers,
                import_typescript23.default.SyntaxKind.ExportKeyword
              )
            )
          );
        case import_typescript23.default.SyntaxKind.ModuleDeclaration:
          return __privateMethod(this, _handleModule, handleModule_fn).call(this, node, continueWithScope);
        case import_typescript23.default.SyntaxKind.MappedType:
          return continueWithScope(
            node,
            new NonRootScope(__privateGet(this, _scope), 4 /* Type */)
          );
        case import_typescript23.default.SyntaxKind.FunctionExpression:
        case import_typescript23.default.SyntaxKind.ArrowFunction:
        case import_typescript23.default.SyntaxKind.Constructor:
        case import_typescript23.default.SyntaxKind.MethodDeclaration:
        case import_typescript23.default.SyntaxKind.FunctionDeclaration:
        case import_typescript23.default.SyntaxKind.GetAccessor:
        case import_typescript23.default.SyntaxKind.SetAccessor:
        case import_typescript23.default.SyntaxKind.MethodSignature:
        case import_typescript23.default.SyntaxKind.CallSignature:
        case import_typescript23.default.SyntaxKind.ConstructSignature:
        case import_typescript23.default.SyntaxKind.ConstructorType:
        case import_typescript23.default.SyntaxKind.FunctionType:
          return __privateMethod(this, _handleFunctionLikeDeclaration, handleFunctionLikeDeclaration_fn).call(this, node, cb, variableCallback);
        case import_typescript23.default.SyntaxKind.ConditionalType:
          return __privateMethod(this, _handleConditionalType, handleConditionalType_fn).call(this, node, cb, variableCallback);
        case import_typescript23.default.SyntaxKind.VariableDeclarationList:
          __privateMethod(this, _handleVariableDeclaration, handleVariableDeclaration_fn).call(this, node);
          break;
        case import_typescript23.default.SyntaxKind.Parameter:
          if (node.parent.kind !== import_typescript23.default.SyntaxKind.IndexSignature && (node.name.kind !== import_typescript23.default.SyntaxKind.Identifier || identifierToKeywordKind(
            node.name
          ) !== import_typescript23.default.SyntaxKind.ThisKeyword))
            __privateMethod(this, _handleBindingName, handleBindingName_fn).call(this, node.name, false, false);
          break;
        case import_typescript23.default.SyntaxKind.EnumMember:
          __privateGet(this, _scope).addVariable(
            getPropertyName(node.name),
            node.name,
            1 /* Function */,
            true,
            4 /* Value */
          );
          break;
        case import_typescript23.default.SyntaxKind.ImportClause:
        case import_typescript23.default.SyntaxKind.ImportSpecifier:
        case import_typescript23.default.SyntaxKind.NamespaceImport:
        case import_typescript23.default.SyntaxKind.ImportEqualsDeclaration:
          __privateMethod(this, _handleDeclaration, handleDeclaration_fn).call(this, node, false, 7 /* Any */ | 8 /* Import */);
          break;
        case import_typescript23.default.SyntaxKind.TypeParameter:
          __privateGet(this, _scope).addVariable(
            node.name.text,
            node.name,
            node.parent.kind === import_typescript23.default.SyntaxKind.InferType ? 8 /* InferType */ : 7 /* Type */,
            false,
            2 /* Type */
          );
          break;
        case import_typescript23.default.SyntaxKind.ExportSpecifier:
          if (node.propertyName !== void 0)
            return __privateGet(this, _scope).markExported(
              node.propertyName,
              node.name
            );
          return __privateGet(this, _scope).markExported(node.name);
        case import_typescript23.default.SyntaxKind.ExportAssignment:
          if (node.expression.kind === import_typescript23.default.SyntaxKind.Identifier)
            return __privateGet(this, _scope).markExported(
              node.expression
            );
          break;
        case import_typescript23.default.SyntaxKind.Identifier: {
          const domain = getUsageDomain(node);
          if (domain !== void 0)
            __privateGet(this, _scope).addUse({ domain, location: node });
          return;
        }
      }
      return import_typescript23.default.forEachChild(node, cb);
    };
    const continueWithScope = (node, scope, next = forEachChild) => {
      const savedScope = __privateGet(this, _scope);
      __privateSet(this, _scope, scope);
      next(node);
      __privateGet(this, _scope).end(variableCallback);
      __privateSet(this, _scope, savedScope);
    };
    const handleBlockScope = (node) => {
      if (node.kind === import_typescript23.default.SyntaxKind.CatchClause && node.variableDeclaration !== void 0)
        __privateMethod(this, _handleBindingName, handleBindingName_fn).call(this, node.variableDeclaration.name, true, false);
      return import_typescript23.default.forEachChild(node, cb);
    };
    import_typescript23.default.forEachChild(sourceFile, cb);
    __privateGet(this, _scope).end(variableCallback);
    return __privateGet(this, _result);
    function forEachChild(node) {
      return import_typescript23.default.forEachChild(node, cb);
    }
  }
};
_result = new WeakMap();
_scope = new WeakMap();
_handleConditionalType = new WeakSet();
handleConditionalType_fn = function(node, cb, varCb) {
  const savedScope = __privateGet(this, _scope);
  const scope = __privateSet(this, _scope, new ConditionalTypeScope(savedScope));
  cb(node.checkType);
  scope.updateState(1 /* Extends */);
  cb(node.extendsType);
  scope.updateState(2 /* TrueType */);
  cb(node.trueType);
  scope.updateState(3 /* FalseType */);
  cb(node.falseType);
  scope.end(varCb);
  __privateSet(this, _scope, savedScope);
};
_handleFunctionLikeDeclaration = new WeakSet();
handleFunctionLikeDeclaration_fn = function(node, cb, varCb) {
  if (canHaveDecorators(node)) {
    getDecorators(node)?.forEach(cb);
  }
  const savedScope = __privateGet(this, _scope);
  if (node.kind === import_typescript23.default.SyntaxKind.FunctionDeclaration)
    __privateMethod(this, _handleDeclaration, handleDeclaration_fn).call(this, node, false, 4 /* Value */);
  const scope = __privateSet(this, _scope, node.kind === import_typescript23.default.SyntaxKind.FunctionExpression && node.name !== void 0 ? new FunctionExpressionScope(node.name, savedScope) : new FunctionScope(savedScope));
  if (node.name !== void 0)
    cb(node.name);
  if (node.typeParameters !== void 0)
    node.typeParameters.forEach(cb);
  node.parameters.forEach(cb);
  if (node.type !== void 0)
    cb(node.type);
  if (node.body !== void 0) {
    scope.beginBody();
    cb(node.body);
  }
  scope.end(varCb);
  __privateSet(this, _scope, savedScope);
};
_handleModule = new WeakSet();
handleModule_fn = function(node, next) {
  if (node.flags & import_typescript23.default.NodeFlags.GlobalAugmentation)
    return next(
      node,
      __privateGet(this, _scope).createOrReuseNamespaceScope("-global", false, true, false)
    );
  if (node.name.kind === import_typescript23.default.SyntaxKind.Identifier) {
    const exported = isNamespaceExported(node);
    __privateGet(this, _scope).addVariable(
      node.name.text,
      node.name,
      1 /* Function */,
      exported,
      1 /* Namespace */ | 4 /* Value */
    );
    const ambient = includesModifier(
      node.modifiers,
      import_typescript23.default.SyntaxKind.DeclareKeyword
    );
    return next(
      node,
      __privateGet(this, _scope).createOrReuseNamespaceScope(
        node.name.text,
        exported,
        ambient,
        ambient && namespaceHasExportStatement(node)
      )
    );
  }
  return next(
    node,
    __privateGet(this, _scope).createOrReuseNamespaceScope(
      `"${node.name.text}"`,
      false,
      true,
      namespaceHasExportStatement(node)
    )
  );
};
_handleDeclaration = new WeakSet();
handleDeclaration_fn = function(node, blockScoped, domain) {
  if (node.name !== void 0)
    __privateGet(this, _scope).addVariable(
      node.name.text,
      node.name,
      blockScoped ? 3 /* Block */ : 1 /* Function */,
      includesModifier(
        node.modifiers,
        import_typescript23.default.SyntaxKind.ExportKeyword
      ),
      domain
    );
};
_handleBindingName = new WeakSet();
handleBindingName_fn = function(name, blockScoped, exported) {
  if (name.kind === import_typescript23.default.SyntaxKind.Identifier)
    return __privateGet(this, _scope).addVariable(
      name.text,
      name,
      blockScoped ? 3 /* Block */ : 1 /* Function */,
      exported,
      4 /* Value */
    );
  forEachDestructuringIdentifier(name, (declaration) => {
    __privateGet(this, _scope).addVariable(
      declaration.name.text,
      declaration.name,
      blockScoped ? 3 /* Block */ : 1 /* Function */,
      exported,
      4 /* Value */
    );
  });
};
_handleVariableDeclaration = new WeakSet();
handleVariableDeclaration_fn = function(declarationList) {
  const blockScoped = isBlockScopedVariableDeclarationList(declarationList);
  const exported = declarationList.parent.kind === import_typescript23.default.SyntaxKind.VariableStatement && includesModifier(
    declarationList.parent.modifiers,
    import_typescript23.default.SyntaxKind.ExportKeyword
  );
  for (const declaration of declarationList.declarations)
    __privateMethod(this, _handleBindingName, handleBindingName_fn).call(this, declaration.name, blockScoped, exported);
};
function isNamespaceExported(node) {
  return node.parent.kind === import_typescript23.default.SyntaxKind.ModuleDeclaration || includesModifier(node.modifiers, import_typescript23.default.SyntaxKind.ExportKeyword);
}
function namespaceHasExportStatement(ns) {
  if (ns.body === void 0 || ns.body.kind !== import_typescript23.default.SyntaxKind.ModuleBlock)
    return false;
  return containsExportStatement(ns.body);
}
function containsExportStatement(block) {
  for (const statement of block.statements)
    if (statement.kind === import_typescript23.default.SyntaxKind.ExportDeclaration || statement.kind === import_typescript23.default.SyntaxKind.ExportAssignment)
      return true;
  return false;
}
function isBlockScopedVariableDeclarationList(declarationList) {
  return (declarationList.flags & import_typescript23.default.NodeFlags.BlockScoped) !== 0;
}
function forEachDestructuringIdentifier(pattern, fn) {
  for (const element of pattern.elements) {
    if (element.kind !== import_typescript23.default.SyntaxKind.BindingElement)
      continue;
    let result;
    if (element.name.kind === import_typescript23.default.SyntaxKind.Identifier) {
      result = fn(element);
    } else {
      result = forEachDestructuringIdentifier(element.name, fn);
    }
    if (result)
      return result;
  }
}

// src/usage/collectVariableUsage.ts
function collectVariableUsage(sourceFile) {
  return new UsageWalker().getUsage(sourceFile);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DeclarationDomain,
  UsageDomain,
  collectVariableUsage,
  forEachComment,
  forEachToken,
  getCallSignaturesOfType,
  getPropertyOfType,
  getWellKnownSymbolPropertyOfType,
  hasDecorators,
  hasExpressionInitializer,
  hasInitializer,
  hasJSDoc,
  hasModifiers,
  hasType,
  hasTypeArguments,
  includesModifier,
  intersectionTypeParts,
  isAbstractKeyword,
  isAccessExpression,
  isAccessibilityModifier,
  isAccessorDeclaration,
  isAccessorKeyword,
  isAnyKeyword,
  isArrayBindingElement,
  isArrayBindingOrAssignmentPattern,
  isAssertKeyword,
  isAssertsKeyword,
  isAssignmentKind,
  isAssignmentPattern,
  isAsyncKeyword,
  isAwaitKeyword,
  isBigIntKeyword,
  isBigIntLiteralType,
  isBindingOrAssignmentElementRestIndicator,
  isBindingOrAssignmentElementTarget,
  isBindingOrAssignmentPattern,
  isBindingPattern,
  isBlockLike,
  isBooleanKeyword,
  isBooleanLiteral,
  isBooleanLiteralType,
  isClassLikeDeclaration,
  isClassMemberModifier,
  isColonToken,
  isCompilerOptionEnabled,
  isConditionalType,
  isConstAssertionExpression,
  isConstKeyword,
  isDeclarationName,
  isDeclarationWithTypeParameterChildren,
  isDeclarationWithTypeParameters,
  isDeclareKeyword,
  isDefaultKeyword,
  isDestructuringPattern,
  isDotToken,
  isEndOfFileToken,
  isEntityNameExpression,
  isEntityNameOrEntityNameExpression,
  isEnumType,
  isEqualsGreaterThanToken,
  isEqualsToken,
  isEvolvingArrayType,
  isExclamationToken,
  isExportKeyword,
  isFalseKeyword,
  isFalseLiteral,
  isFalseLiteralType,
  isFalsyType,
  isForInOrOfStatement,
  isFreshableIntrinsicType,
  isFreshableType,
  isFunctionLikeDeclaration,
  isFunctionScopeBoundary,
  isImportExpression,
  isImportKeyword,
  isInKeyword,
  isIndexType,
  isIndexedAccessType,
  isInputFiles,
  isInstantiableType,
  isIntersectionType,
  isIntrinsicAnyType,
  isIntrinsicBigIntType,
  isIntrinsicBooleanType,
  isIntrinsicESSymbolType,
  isIntrinsicErrorType,
  isIntrinsicNeverType,
  isIntrinsicNonPrimitiveType,
  isIntrinsicNullType,
  isIntrinsicNumberType,
  isIntrinsicStringType,
  isIntrinsicType,
  isIntrinsicUndefinedType,
  isIntrinsicUnknownType,
  isIntrinsicVoidType,
  isIterationStatement,
  isJSDocComment,
  isJSDocNamespaceBody,
  isJSDocNamespaceDeclaration,
  isJSDocText,
  isJSDocTypeReferencingNode,
  isJsonMinusNumericLiteral,
  isJsonObjectExpression,
  isJsxAttributeLike,
  isJsxAttributeValue,
  isJsxChild,
  isJsxTagNameExpression,
  isJsxTagNamePropertyAccess,
  isLiteralToken,
  isLiteralType,
  isModifierFlagSet,
  isModuleBody,
  isModuleName,
  isModuleReference,
  isNamedDeclarationWithName,
  isNamedImportBindings,
  isNamedImportsOrExports,
  isNamespaceBody,
  isNamespaceDeclaration,
  isNeverKeyword,
  isNodeFlagSet,
  isNullKeyword,
  isNullLiteral,
  isNumberKeyword,
  isNumberLiteralType,
  isNumericOrStringLikeLiteral,
  isNumericPropertyName,
  isObjectBindingOrAssignmentElement,
  isObjectBindingOrAssignmentPattern,
  isObjectFlagSet,
  isObjectKeyword,
  isObjectType,
  isObjectTypeDeclaration,
  isOutKeyword,
  isOverrideKeyword,
  isParameterPropertyModifier,
  isPrivateKeyword,
  isPropertyAccessEntityNameExpression,
  isPropertyNameLiteral,
  isPropertyReadonlyInType,
  isProtectedKeyword,
  isPseudoLiteralToken,
  isPublicKeyword,
  isQuestionDotToken,
  isQuestionToken,
  isReadonlyKeyword,
  isSignatureDeclaration,
  isStaticKeyword,
  isStrictCompilerOptionEnabled,
  isStringKeyword,
  isStringLiteralType,
  isStringMappingType,
  isSubstitutionType,
  isSuperElementAccessExpression,
  isSuperExpression,
  isSuperKeyword,
  isSuperProperty,
  isSuperPropertyAccessExpression,
  isSymbolFlagSet,
  isSymbolKeyword,
  isSyntaxList,
  isTemplateLiteralType,
  isThenableType,
  isThisExpression,
  isThisKeyword,
  isTrueKeyword,
  isTrueLiteral,
  isTrueLiteralType,
  isTupleType,
  isTupleTypeReference,
  isTypeFlagSet,
  isTypeOnlyCompatibleAliasDeclaration,
  isTypeParameter,
  isTypeReference,
  isTypeReferenceType,
  isTypeVariable,
  isUndefinedKeyword,
  isUnionOrIntersectionType,
  isUnionOrIntersectionTypeNode,
  isUnionType,
  isUniqueESSymbolType,
  isUnknownKeyword,
  isUnknownLiteralType,
  isUnparsedPrologue,
  isUnparsedSourceText,
  isUnparsedSyntheticReference,
  isValidPropertyAccess,
  isVariableLikeDeclaration,
  isVoidKeyword,
  symbolHasReadonlyDeclaration,
  unionTypeParts
});
