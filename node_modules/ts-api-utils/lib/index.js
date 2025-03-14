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

// src/comments.ts
import ts2 from "typescript";

// src/tokens.ts
import ts from "typescript";
function forEachToken(node, callback, sourceFile = node.getSourceFile()) {
  const queue = [];
  while (true) {
    if (ts.isTokenKind(node.kind)) {
      callback(node);
    } else if (
      // eslint-disable-next-line deprecation/deprecation -- need for support of TS < 4.7
      node.kind !== ts.SyntaxKind.JSDocComment
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
    case ts2.SyntaxKind.CloseBraceToken:
      return token.parent.kind !== ts2.SyntaxKind.JsxExpression || !isJsxElementOrFragment(token.parent.parent);
    case ts2.SyntaxKind.GreaterThanToken:
      switch (token.parent.kind) {
        case ts2.SyntaxKind.JsxOpeningElement:
          return token.end !== token.parent.end;
        case ts2.SyntaxKind.JsxOpeningFragment:
          return false;
        case ts2.SyntaxKind.JsxSelfClosingElement:
          return token.end !== token.parent.end || // if end is not equal, this is part of the type arguments list
          !isJsxElementOrFragment(token.parent.parent);
        case ts2.SyntaxKind.JsxClosingElement:
        case ts2.SyntaxKind.JsxClosingFragment:
          return !isJsxElementOrFragment(token.parent.parent.parent);
      }
  }
  return true;
}
function isJsxElementOrFragment(node) {
  return node.kind === ts2.SyntaxKind.JsxElement || node.kind === ts2.SyntaxKind.JsxFragment;
}
function forEachComment(node, callback, sourceFile = node.getSourceFile()) {
  const fullText = sourceFile.text;
  const notJsx = sourceFile.languageVariant !== ts2.LanguageVariant.JSX;
  return forEachToken(
    node,
    (token) => {
      if (token.pos === token.end)
        return;
      if (token.kind !== ts2.SyntaxKind.JsxText)
        ts2.forEachLeadingCommentRange(
          fullText,
          // skip shebang at position 0
          token.pos === 0 ? (ts2.getShebang(fullText) ?? "").length : token.pos,
          commentCallback
        );
      if (notJsx || canHaveTrailingTrivia(token))
        return ts2.forEachTrailingCommentRange(
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
import ts3 from "typescript";
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
      return options.allowSyntheticDefaultImports !== void 0 ? options.allowSyntheticDefaultImports : isCompilerOptionEnabled(options, "esModuleInterop") || options.module === ts3.ModuleKind.System;
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
import ts4 from "typescript";
function isFlagSet(allFlags, flag) {
  return (allFlags & flag) !== 0;
}
function isFlagSetOnObject(obj, flag) {
  return isFlagSet(obj.flags, flag);
}
function isModifierFlagSet(node, flag) {
  return isFlagSet(ts4.getCombinedModifierFlags(node), flag);
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
import ts8 from "typescript";

// src/nodes/typeGuards/single.ts
import ts5 from "typescript";
function isAbstractKeyword(node) {
  return node.kind === ts5.SyntaxKind.AbstractKeyword;
}
function isAccessorKeyword(node) {
  return node.kind === ts5.SyntaxKind.AccessorKeyword;
}
function isAnyKeyword(node) {
  return node.kind === ts5.SyntaxKind.AnyKeyword;
}
function isAssertKeyword(node) {
  return node.kind === ts5.SyntaxKind.AssertKeyword;
}
function isAssertsKeyword(node) {
  return node.kind === ts5.SyntaxKind.AssertsKeyword;
}
function isAsyncKeyword(node) {
  return node.kind === ts5.SyntaxKind.AsyncKeyword;
}
function isAwaitKeyword(node) {
  return node.kind === ts5.SyntaxKind.AwaitKeyword;
}
function isBigIntKeyword(node) {
  return node.kind === ts5.SyntaxKind.BigIntKeyword;
}
function isBooleanKeyword(node) {
  return node.kind === ts5.SyntaxKind.BooleanKeyword;
}
function isColonToken(node) {
  return node.kind === ts5.SyntaxKind.ColonToken;
}
function isConstKeyword(node) {
  return node.kind === ts5.SyntaxKind.ConstKeyword;
}
function isDeclareKeyword(node) {
  return node.kind === ts5.SyntaxKind.DeclareKeyword;
}
function isDefaultKeyword(node) {
  return node.kind === ts5.SyntaxKind.DefaultKeyword;
}
function isDotToken(node) {
  return node.kind === ts5.SyntaxKind.DotToken;
}
function isEndOfFileToken(node) {
  return node.kind === ts5.SyntaxKind.EndOfFileToken;
}
function isEqualsGreaterThanToken(node) {
  return node.kind === ts5.SyntaxKind.EqualsGreaterThanToken;
}
function isEqualsToken(node) {
  return node.kind === ts5.SyntaxKind.EqualsToken;
}
function isExclamationToken(node) {
  return node.kind === ts5.SyntaxKind.ExclamationToken;
}
function isExportKeyword(node) {
  return node.kind === ts5.SyntaxKind.ExportKeyword;
}
function isFalseKeyword(node) {
  return node.kind === ts5.SyntaxKind.FalseKeyword;
}
function isFalseLiteral(node) {
  return node.kind === ts5.SyntaxKind.FalseKeyword;
}
function isImportExpression(node) {
  return node.kind === ts5.SyntaxKind.ImportKeyword;
}
function isImportKeyword(node) {
  return node.kind === ts5.SyntaxKind.ImportKeyword;
}
function isInKeyword(node) {
  return node.kind === ts5.SyntaxKind.InKeyword;
}
function isInputFiles(node) {
  return node.kind === ts5.SyntaxKind.InputFiles;
}
function isJSDocText(node) {
  return node.kind === ts5.SyntaxKind.JSDocText;
}
function isJsonMinusNumericLiteral(node) {
  return node.kind === ts5.SyntaxKind.PrefixUnaryExpression;
}
function isNeverKeyword(node) {
  return node.kind === ts5.SyntaxKind.NeverKeyword;
}
function isNullKeyword(node) {
  return node.kind === ts5.SyntaxKind.NullKeyword;
}
function isNullLiteral(node) {
  return node.kind === ts5.SyntaxKind.NullKeyword;
}
function isNumberKeyword(node) {
  return node.kind === ts5.SyntaxKind.NumberKeyword;
}
function isObjectKeyword(node) {
  return node.kind === ts5.SyntaxKind.ObjectKeyword;
}
function isOutKeyword(node) {
  return node.kind === ts5.SyntaxKind.OutKeyword;
}
function isOverrideKeyword(node) {
  return node.kind === ts5.SyntaxKind.OverrideKeyword;
}
function isPrivateKeyword(node) {
  return node.kind === ts5.SyntaxKind.PrivateKeyword;
}
function isProtectedKeyword(node) {
  return node.kind === ts5.SyntaxKind.ProtectedKeyword;
}
function isPublicKeyword(node) {
  return node.kind === ts5.SyntaxKind.PublicKeyword;
}
function isQuestionDotToken(node) {
  return node.kind === ts5.SyntaxKind.QuestionDotToken;
}
function isQuestionToken(node) {
  return node.kind === ts5.SyntaxKind.QuestionToken;
}
function isReadonlyKeyword(node) {
  return node.kind === ts5.SyntaxKind.ReadonlyKeyword;
}
function isStaticKeyword(node) {
  return node.kind === ts5.SyntaxKind.StaticKeyword;
}
function isStringKeyword(node) {
  return node.kind === ts5.SyntaxKind.StringKeyword;
}
function isSuperExpression(node) {
  return node.kind === ts5.SyntaxKind.SuperKeyword;
}
function isSuperKeyword(node) {
  return node.kind === ts5.SyntaxKind.SuperKeyword;
}
function isSymbolKeyword(node) {
  return node.kind === ts5.SyntaxKind.SymbolKeyword;
}
function isSyntaxList(node) {
  return node.kind === ts5.SyntaxKind.SyntaxList;
}
function isThisExpression(node) {
  return node.kind === ts5.SyntaxKind.ThisKeyword;
}
function isThisKeyword(node) {
  return node.kind === ts5.SyntaxKind.ThisKeyword;
}
function isTrueKeyword(node) {
  return node.kind === ts5.SyntaxKind.TrueKeyword;
}
function isTrueLiteral(node) {
  return node.kind === ts5.SyntaxKind.TrueKeyword;
}
function isUndefinedKeyword(node) {
  return node.kind === ts5.SyntaxKind.UndefinedKeyword;
}
function isUnknownKeyword(node) {
  return node.kind === ts5.SyntaxKind.UnknownKeyword;
}
function isUnparsedPrologue(node) {
  return node.kind === ts5.SyntaxKind.UnparsedPrologue;
}
function isUnparsedSyntheticReference(node) {
  return node.kind === ts5.SyntaxKind.UnparsedSyntheticReference;
}
function isVoidKeyword(node) {
  return node.kind === ts5.SyntaxKind.VoidKeyword;
}

// src/nodes/typeGuards/union.ts
import ts7 from "typescript";

// src/utils.ts
import ts6 from "typescript";
var [tsMajor, tsMinor] = ts6.versionMajorMinor.split(".").map((raw) => Number.parseInt(raw, 10));
function isTsVersionAtLeast(major, minor = 0) {
  return tsMajor > major || tsMajor === major && tsMinor >= minor;
}

// src/nodes/typeGuards/union.ts
function isAccessExpression(node) {
  return ts7.isPropertyAccessExpression(node) || ts7.isElementAccessExpression(node);
}
function isAccessibilityModifier(node) {
  return isPublicKeyword(node) || isPrivateKeyword(node) || isProtectedKeyword(node);
}
function isAccessorDeclaration(node) {
  return ts7.isGetAccessorDeclaration(node) || ts7.isSetAccessorDeclaration(node);
}
function isArrayBindingElement(node) {
  return ts7.isBindingElement(node) || ts7.isOmittedExpression(node);
}
function isArrayBindingOrAssignmentPattern(node) {
  return ts7.isArrayBindingPattern(node) || ts7.isArrayLiteralExpression(node);
}
function isAssignmentPattern(node) {
  return ts7.isObjectLiteralExpression(node) || ts7.isArrayLiteralExpression(node);
}
function isBindingOrAssignmentElementRestIndicator(node) {
  if (ts7.isSpreadElement(node) || ts7.isSpreadAssignment(node)) {
    return true;
  }
  if (isTsVersionAtLeast(4, 4)) {
    return ts7.isDotDotDotToken(node);
  }
  return false;
}
function isBindingOrAssignmentElementTarget(node) {
  return isBindingOrAssignmentPattern(node) || ts7.isIdentifier(node) || ts7.isPropertyAccessExpression(node) || ts7.isElementAccessExpression(node) || ts7.isOmittedExpression(node);
}
function isBindingOrAssignmentPattern(node) {
  return isObjectBindingOrAssignmentPattern(node) || isArrayBindingOrAssignmentPattern(node);
}
function isBindingPattern(node) {
  return ts7.isObjectBindingPattern(node) || ts7.isArrayBindingPattern(node);
}
function isBlockLike(node) {
  return ts7.isSourceFile(node) || ts7.isBlock(node) || ts7.isModuleBlock(node) || ts7.isCaseOrDefaultClause(node);
}
function isBooleanLiteral(node) {
  return isTrueLiteral(node) || isFalseLiteral(node);
}
function isClassLikeDeclaration(node) {
  return ts7.isClassDeclaration(node) || ts7.isClassExpression(node);
}
function isClassMemberModifier(node) {
  return isAccessibilityModifier(node) || isReadonlyKeyword(node) || isStaticKeyword(node) || isAccessorKeyword(node);
}
function isDeclarationName(node) {
  return ts7.isIdentifier(node) || ts7.isPrivateIdentifier(node) || ts7.isStringLiteralLike(node) || ts7.isNumericLiteral(node) || ts7.isComputedPropertyName(node) || ts7.isElementAccessExpression(node) || isBindingPattern(node) || isEntityNameExpression(node);
}
function isDeclarationWithTypeParameterChildren(node) {
  return isSignatureDeclaration(node) || // eslint-disable-next-line deprecation/deprecation -- Keep compatibility with ts <5
  isClassLikeDeclaration(node) || ts7.isInterfaceDeclaration(node) || ts7.isTypeAliasDeclaration(node) || ts7.isJSDocTemplateTag(node);
}
function isDeclarationWithTypeParameters(node) {
  return isDeclarationWithTypeParameterChildren(node) || ts7.isJSDocTypedefTag(node) || ts7.isJSDocCallbackTag(node) || ts7.isJSDocSignature(node);
}
function isDestructuringPattern(node) {
  return isBindingPattern(node) || ts7.isObjectLiteralExpression(node) || ts7.isArrayLiteralExpression(node);
}
function isEntityNameExpression(node) {
  return ts7.isIdentifier(node) || isPropertyAccessEntityNameExpression(node);
}
function isEntityNameOrEntityNameExpression(node) {
  return ts7.isEntityName(node) || isEntityNameExpression(node);
}
function isForInOrOfStatement(node) {
  return ts7.isForInStatement(node) || ts7.isForOfStatement(node);
}
function isFunctionLikeDeclaration(node) {
  return ts7.isFunctionDeclaration(node) || ts7.isMethodDeclaration(node) || ts7.isGetAccessorDeclaration(node) || ts7.isSetAccessorDeclaration(node) || ts7.isConstructorDeclaration(node) || ts7.isFunctionExpression(node) || ts7.isArrowFunction(node);
}
function hasDecorators(node) {
  return ts7.isParameter(node) || ts7.isPropertyDeclaration(node) || ts7.isMethodDeclaration(node) || ts7.isGetAccessorDeclaration(node) || ts7.isSetAccessorDeclaration(node) || ts7.isClassExpression(node) || ts7.isClassDeclaration(node);
}
function hasExpressionInitializer(node) {
  return ts7.isVariableDeclaration(node) || ts7.isParameter(node) || ts7.isBindingElement(node) || ts7.isPropertyDeclaration(node) || ts7.isPropertyAssignment(node) || ts7.isEnumMember(node);
}
function hasInitializer(node) {
  return hasExpressionInitializer(node) || ts7.isForStatement(node) || ts7.isForInStatement(node) || ts7.isForOfStatement(node) || ts7.isJsxAttribute(node);
}
function hasJSDoc(node) {
  if (
    // eslint-disable-next-line deprecation/deprecation -- Keep compatibility with ts <5
    isAccessorDeclaration(node) || ts7.isArrowFunction(node) || ts7.isBlock(node) || ts7.isBreakStatement(node) || ts7.isCallSignatureDeclaration(node) || ts7.isCaseClause(node) || // eslint-disable-next-line deprecation/deprecation -- Keep compatibility with ts <5
    isClassLikeDeclaration(node) || ts7.isConstructorDeclaration(node) || ts7.isConstructorTypeNode(node) || ts7.isConstructSignatureDeclaration(node) || ts7.isContinueStatement(node) || ts7.isDebuggerStatement(node) || ts7.isDoStatement(node) || ts7.isEmptyStatement(node) || isEndOfFileToken(node) || ts7.isEnumDeclaration(node) || ts7.isEnumMember(node) || ts7.isExportAssignment(node) || ts7.isExportDeclaration(node) || ts7.isExportSpecifier(node) || ts7.isExpressionStatement(node) || ts7.isForInStatement(node) || ts7.isForOfStatement(node) || ts7.isForStatement(node) || ts7.isFunctionDeclaration(node) || ts7.isFunctionExpression(node) || ts7.isFunctionTypeNode(node) || ts7.isIfStatement(node) || ts7.isImportDeclaration(node) || ts7.isImportEqualsDeclaration(node) || ts7.isIndexSignatureDeclaration(node) || ts7.isInterfaceDeclaration(node) || ts7.isJSDocFunctionType(node) || ts7.isLabeledStatement(node) || ts7.isMethodDeclaration(node) || ts7.isMethodSignature(node) || ts7.isModuleDeclaration(node) || ts7.isNamedTupleMember(node) || ts7.isNamespaceExportDeclaration(node) || ts7.isParameter(node) || ts7.isParenthesizedExpression(node) || ts7.isPropertyAssignment(node) || ts7.isPropertyDeclaration(node) || ts7.isPropertySignature(node) || ts7.isReturnStatement(node) || ts7.isShorthandPropertyAssignment(node) || ts7.isSpreadAssignment(node) || ts7.isSwitchStatement(node) || ts7.isThrowStatement(node) || ts7.isTryStatement(node) || ts7.isTypeAliasDeclaration(node) || ts7.isVariableDeclaration(node) || ts7.isVariableStatement(node) || ts7.isWhileStatement(node) || ts7.isWithStatement(node)
  ) {
    return true;
  }
  if (isTsVersionAtLeast(4, 4) && ts7.isClassStaticBlockDeclaration(node)) {
    return true;
  }
  if (isTsVersionAtLeast(5, 0) && (ts7.isBinaryExpression(node) || ts7.isElementAccessExpression(node) || ts7.isIdentifier(node) || ts7.isJSDocSignature(node) || ts7.isObjectLiteralExpression(node) || ts7.isPropertyAccessExpression(node) || ts7.isTypeParameterDeclaration(node))) {
    return true;
  }
  return false;
}
function hasModifiers(node) {
  return ts7.isTypeParameterDeclaration(node) || ts7.isParameter(node) || ts7.isConstructorTypeNode(node) || ts7.isPropertySignature(node) || ts7.isPropertyDeclaration(node) || ts7.isMethodSignature(node) || ts7.isMethodDeclaration(node) || ts7.isConstructorDeclaration(node) || ts7.isGetAccessorDeclaration(node) || ts7.isSetAccessorDeclaration(node) || ts7.isIndexSignatureDeclaration(node) || ts7.isFunctionExpression(node) || ts7.isArrowFunction(node) || ts7.isClassExpression(node) || ts7.isVariableStatement(node) || ts7.isFunctionDeclaration(node) || ts7.isClassDeclaration(node) || ts7.isInterfaceDeclaration(node) || ts7.isTypeAliasDeclaration(node) || ts7.isEnumDeclaration(node) || ts7.isModuleDeclaration(node) || ts7.isImportEqualsDeclaration(node) || ts7.isImportDeclaration(node) || ts7.isExportAssignment(node) || ts7.isExportDeclaration(node);
}
function hasType(node) {
  return isSignatureDeclaration(node) || ts7.isVariableDeclaration(node) || ts7.isParameter(node) || ts7.isPropertySignature(node) || ts7.isPropertyDeclaration(node) || ts7.isTypePredicateNode(node) || ts7.isParenthesizedTypeNode(node) || ts7.isTypeOperatorNode(node) || ts7.isMappedTypeNode(node) || ts7.isAssertionExpression(node) || ts7.isTypeAliasDeclaration(node) || ts7.isJSDocTypeExpression(node) || ts7.isJSDocNonNullableType(node) || ts7.isJSDocNullableType(node) || ts7.isJSDocOptionalType(node) || ts7.isJSDocVariadicType(node);
}
function hasTypeArguments(node) {
  return ts7.isCallExpression(node) || ts7.isNewExpression(node) || ts7.isTaggedTemplateExpression(node) || ts7.isJsxOpeningElement(node) || ts7.isJsxSelfClosingElement(node);
}
function isJSDocComment(node) {
  if (isJSDocText(node)) {
    return true;
  }
  if (isTsVersionAtLeast(4, 4)) {
    return ts7.isJSDocLink(node) || ts7.isJSDocLinkCode(node) || ts7.isJSDocLinkPlain(node);
  }
  return false;
}
function isJSDocNamespaceBody(node) {
  return ts7.isIdentifier(node) || isJSDocNamespaceDeclaration(node);
}
function isJSDocTypeReferencingNode(node) {
  return ts7.isJSDocVariadicType(node) || ts7.isJSDocOptionalType(node) || ts7.isJSDocNullableType(node) || ts7.isJSDocNonNullableType(node);
}
function isJsonObjectExpression(node) {
  return ts7.isObjectLiteralExpression(node) || ts7.isArrayLiteralExpression(node) || isJsonMinusNumericLiteral(node) || ts7.isNumericLiteral(node) || ts7.isStringLiteral(node) || isBooleanLiteral(node) || isNullLiteral(node);
}
function isJsxAttributeLike(node) {
  return ts7.isJsxAttribute(node) || ts7.isJsxSpreadAttribute(node);
}
function isJsxAttributeValue(node) {
  return ts7.isStringLiteral(node) || ts7.isJsxExpression(node) || ts7.isJsxElement(node) || ts7.isJsxSelfClosingElement(node) || ts7.isJsxFragment(node);
}
function isJsxChild(node) {
  return ts7.isJsxText(node) || ts7.isJsxExpression(node) || ts7.isJsxElement(node) || ts7.isJsxSelfClosingElement(node) || ts7.isJsxFragment(node);
}
function isJsxTagNameExpression(node) {
  return ts7.isIdentifier(node) || isThisExpression(node) || isJsxTagNamePropertyAccess(node);
}
function isLiteralToken(node) {
  return ts7.isNumericLiteral(node) || ts7.isBigIntLiteral(node) || ts7.isStringLiteral(node) || ts7.isJsxText(node) || ts7.isRegularExpressionLiteral(node) || ts7.isNoSubstitutionTemplateLiteral(node);
}
function isModuleBody(node) {
  return isNamespaceBody(node) || isJSDocNamespaceBody(node);
}
function isModuleName(node) {
  return ts7.isIdentifier(node) || ts7.isStringLiteral(node);
}
function isModuleReference(node) {
  return ts7.isEntityName(node) || ts7.isExternalModuleReference(node);
}
function isNamedImportBindings(node) {
  return ts7.isNamespaceImport(node) || ts7.isNamedImports(node);
}
function isNamedImportsOrExports(node) {
  return ts7.isNamedImports(node) || ts7.isNamedExports(node);
}
function isNamespaceBody(node) {
  return ts7.isModuleBlock(node) || isNamespaceDeclaration(node);
}
function isObjectBindingOrAssignmentElement(node) {
  return ts7.isBindingElement(node) || ts7.isPropertyAssignment(node) || ts7.isShorthandPropertyAssignment(node) || ts7.isSpreadAssignment(node);
}
function isObjectBindingOrAssignmentPattern(node) {
  return ts7.isObjectBindingPattern(node) || ts7.isObjectLiteralExpression(node);
}
function isObjectTypeDeclaration(node) {
  return (
    // eslint-disable-next-line deprecation/deprecation -- Keep compatibility with ts <5
    isClassLikeDeclaration(node) || ts7.isInterfaceDeclaration(node) || ts7.isTypeLiteralNode(node)
  );
}
function isParameterPropertyModifier(node) {
  return isAccessibilityModifier(node) || isReadonlyKeyword(node);
}
function isPropertyNameLiteral(node) {
  return ts7.isIdentifier(node) || ts7.isStringLiteralLike(node) || ts7.isNumericLiteral(node);
}
function isPseudoLiteralToken(node) {
  return ts7.isTemplateHead(node) || ts7.isTemplateMiddle(node) || ts7.isTemplateTail(node);
}
function isSignatureDeclaration(node) {
  return ts7.isCallSignatureDeclaration(node) || ts7.isConstructSignatureDeclaration(node) || ts7.isMethodSignature(node) || ts7.isIndexSignatureDeclaration(node) || ts7.isFunctionTypeNode(node) || ts7.isConstructorTypeNode(node) || ts7.isJSDocFunctionType(node) || ts7.isFunctionDeclaration(node) || ts7.isMethodDeclaration(node) || ts7.isConstructorDeclaration(node) || // eslint-disable-next-line deprecation/deprecation -- Keep compatibility with ts <5
  isAccessorDeclaration(node) || ts7.isFunctionExpression(node) || ts7.isArrowFunction(node);
}
function isSuperProperty(node) {
  return isSuperPropertyAccessExpression(node) || isSuperElementAccessExpression(node);
}
function isTypeOnlyCompatibleAliasDeclaration(node) {
  if (ts7.isImportClause(node) || ts7.isImportEqualsDeclaration(node) || ts7.isNamespaceImport(node) || ts7.isImportOrExportSpecifier(node)) {
    return true;
  }
  if (isTsVersionAtLeast(5, 0) && (ts7.isExportDeclaration(node) || ts7.isNamespaceExport(node))) {
    return true;
  }
  return false;
}
function isTypeReferenceType(node) {
  return ts7.isTypeReferenceNode(node) || ts7.isExpressionWithTypeArguments(node);
}
function isUnionOrIntersectionTypeNode(node) {
  return ts7.isUnionTypeNode(node) || ts7.isIntersectionTypeNode(node);
}
function isUnparsedSourceText(node) {
  return ts7.isUnparsedPrepend(node) || ts7.isUnparsedTextLike(node);
}
function isVariableLikeDeclaration(node) {
  return ts7.isVariableDeclaration(node) || ts7.isParameter(node) || ts7.isBindingElement(node) || ts7.isPropertyDeclaration(node) || ts7.isPropertyAssignment(node) || ts7.isPropertySignature(node) || ts7.isJsxAttribute(node) || ts7.isShorthandPropertyAssignment(node) || ts7.isEnumMember(node) || ts7.isJSDocPropertyTag(node) || ts7.isJSDocParameterTag(node);
}

// src/nodes/typeGuards/compound.ts
function isConstAssertionExpression(node) {
  return ts8.isTypeReferenceNode(node.type) && ts8.isIdentifier(node.type.typeName) && node.type.typeName.escapedText === "const";
}
function isIterationStatement(node) {
  switch (node.kind) {
    case ts8.SyntaxKind.DoStatement:
    case ts8.SyntaxKind.ForInStatement:
    case ts8.SyntaxKind.ForOfStatement:
    case ts8.SyntaxKind.ForStatement:
    case ts8.SyntaxKind.WhileStatement:
      return true;
    default:
      return false;
  }
}
function isJSDocNamespaceDeclaration(node) {
  return ts8.isModuleDeclaration(node) && ts8.isIdentifier(node.name) && (node.body === void 0 || isJSDocNamespaceBody(node.body));
}
function isJsxTagNamePropertyAccess(node) {
  return ts8.isPropertyAccessExpression(node) && // eslint-disable-next-line deprecation/deprecation -- Keep compatibility with ts < 5
  isJsxTagNameExpression(node.expression);
}
function isNamedDeclarationWithName(node) {
  return "name" in node && node.name !== void 0 && node.name !== null && isDeclarationName(node.name);
}
function isNamespaceDeclaration(node) {
  return ts8.isModuleDeclaration(node) && ts8.isIdentifier(node.name) && node.body !== void 0 && isNamespaceBody(node.body);
}
function isNumericOrStringLikeLiteral(node) {
  switch (node.kind) {
    case ts8.SyntaxKind.StringLiteral:
    case ts8.SyntaxKind.NumericLiteral:
    case ts8.SyntaxKind.NoSubstitutionTemplateLiteral:
      return true;
    default:
      return false;
  }
}
function isPropertyAccessEntityNameExpression(node) {
  return ts8.isPropertyAccessExpression(node) && ts8.isIdentifier(node.name) && isEntityNameExpression(node.expression);
}
function isSuperElementAccessExpression(node) {
  return ts8.isElementAccessExpression(node) && isSuperExpression(node.expression);
}
function isSuperPropertyAccessExpression(node) {
  return ts8.isPropertyAccessExpression(node) && isSuperExpression(node.expression);
}

// src/scopes.ts
import ts9 from "typescript";
function isFunctionScopeBoundary(node) {
  switch (node.kind) {
    case ts9.SyntaxKind.FunctionExpression:
    case ts9.SyntaxKind.ArrowFunction:
    case ts9.SyntaxKind.Constructor:
    case ts9.SyntaxKind.ModuleDeclaration:
    case ts9.SyntaxKind.ClassDeclaration:
    case ts9.SyntaxKind.ClassExpression:
    case ts9.SyntaxKind.EnumDeclaration:
    case ts9.SyntaxKind.MethodDeclaration:
    case ts9.SyntaxKind.FunctionDeclaration:
    case ts9.SyntaxKind.GetAccessor:
    case ts9.SyntaxKind.SetAccessor:
    case ts9.SyntaxKind.MethodSignature:
    case ts9.SyntaxKind.CallSignature:
    case ts9.SyntaxKind.ConstructSignature:
    case ts9.SyntaxKind.ConstructorType:
    case ts9.SyntaxKind.FunctionType:
      return true;
    case ts9.SyntaxKind.SourceFile:
      return ts9.isExternalModule(node);
    default:
      return false;
  }
}

// src/syntax.ts
import ts10 from "typescript";
function isAssignmentKind(kind) {
  return kind >= ts10.SyntaxKind.FirstAssignment && kind <= ts10.SyntaxKind.LastAssignment;
}
function isNumericPropertyName(name) {
  return String(+name) === name;
}
function charSize(ch) {
  return ch >= 65536 ? 2 : 1;
}
function isValidPropertyAccess(text, languageVersion = ts10.ScriptTarget.Latest) {
  if (text.length === 0)
    return false;
  let ch = text.codePointAt(0);
  if (!ts10.isIdentifierStart(ch, languageVersion))
    return false;
  for (let i = charSize(ch); i < text.length; i += charSize(ch)) {
    ch = text.codePointAt(i);
    if (!ts10.isIdentifierPart(ch, languageVersion))
      return false;
  }
  return true;
}

// src/types/getters.ts
import ts15 from "typescript";

// src/types/typeGuards/intrinsic.ts
import ts11 from "typescript";
function isIntrinsicAnyType(type) {
  return isTypeFlagSet(type, ts11.TypeFlags.Any);
}
function isIntrinsicBooleanType(type) {
  return isTypeFlagSet(type, ts11.TypeFlags.Boolean);
}
function isIntrinsicBigIntType(type) {
  return isTypeFlagSet(type, ts11.TypeFlags.BigInt);
}
function isIntrinsicErrorType(type) {
  return isIntrinsicType(type) && type.intrinsicName === "error";
}
function isIntrinsicESSymbolType(type) {
  return isTypeFlagSet(type, ts11.TypeFlags.ESSymbol);
}
var IntrinsicTypeFlags = ts11.TypeFlags.Intrinsic ?? ts11.TypeFlags.Any | ts11.TypeFlags.Unknown | ts11.TypeFlags.String | ts11.TypeFlags.Number | ts11.TypeFlags.BigInt | ts11.TypeFlags.Boolean | ts11.TypeFlags.BooleanLiteral | ts11.TypeFlags.ESSymbol | ts11.TypeFlags.Void | ts11.TypeFlags.Undefined | ts11.TypeFlags.Null | ts11.TypeFlags.Never | ts11.TypeFlags.NonPrimitive;
function isIntrinsicType(type) {
  return isTypeFlagSet(type, IntrinsicTypeFlags);
}
function isIntrinsicNeverType(type) {
  return isTypeFlagSet(type, ts11.TypeFlags.Never);
}
function isIntrinsicNonPrimitiveType(type) {
  return isTypeFlagSet(type, ts11.TypeFlags.NonPrimitive);
}
function isIntrinsicNullType(type) {
  return isTypeFlagSet(type, ts11.TypeFlags.Null);
}
function isIntrinsicNumberType(type) {
  return isTypeFlagSet(type, ts11.TypeFlags.Number);
}
function isIntrinsicStringType(type) {
  return isTypeFlagSet(type, ts11.TypeFlags.String);
}
function isIntrinsicUndefinedType(type) {
  return isTypeFlagSet(type, ts11.TypeFlags.Undefined);
}
function isIntrinsicUnknownType(type) {
  return isTypeFlagSet(type, ts11.TypeFlags.Unknown);
}
function isIntrinsicVoidType(type) {
  return isTypeFlagSet(type, ts11.TypeFlags.Void);
}

// src/types/typeGuards/objects.ts
import ts13 from "typescript";

// src/types/typeGuards/single.ts
import ts12 from "typescript";
function isConditionalType(type) {
  return isTypeFlagSet(type, ts12.TypeFlags.Conditional);
}
function isEnumType(type) {
  return isTypeFlagSet(type, ts12.TypeFlags.Enum);
}
function isFreshableType(type) {
  return isTypeFlagSet(type, ts12.TypeFlags.Freshable);
}
function isIndexType(type) {
  return isTypeFlagSet(type, ts12.TypeFlags.Index);
}
function isIndexedAccessType(type) {
  return isTypeFlagSet(type, ts12.TypeFlags.IndexedAccess);
}
function isInstantiableType(type) {
  return isTypeFlagSet(type, ts12.TypeFlags.Instantiable);
}
function isIntersectionType(type) {
  return isTypeFlagSet(type, ts12.TypeFlags.Intersection);
}
function isObjectType(type) {
  return isTypeFlagSet(type, ts12.TypeFlags.Object);
}
function isStringMappingType(type) {
  return isTypeFlagSet(type, ts12.TypeFlags.StringMapping);
}
function isSubstitutionType(type) {
  return isTypeFlagSet(type, ts12.TypeFlags.Substitution);
}
function isTypeParameter(type) {
  return isTypeFlagSet(type, ts12.TypeFlags.TypeParameter);
}
function isTypeVariable(type) {
  return isTypeFlagSet(type, ts12.TypeFlags.TypeVariable);
}
function isUnionType(type) {
  return isTypeFlagSet(type, ts12.TypeFlags.Union);
}
function isUnionOrIntersectionType(type) {
  return isTypeFlagSet(type, ts12.TypeFlags.UnionOrIntersection);
}
function isUniqueESSymbolType(type) {
  return isTypeFlagSet(type, ts12.TypeFlags.UniqueESSymbol);
}

// src/types/typeGuards/objects.ts
function isEvolvingArrayType(type) {
  return isObjectType(type) && isObjectFlagSet(type, ts13.ObjectFlags.EvolvingArray);
}
function isTupleType(type) {
  return isObjectType(type) && isObjectFlagSet(type, ts13.ObjectFlags.Tuple);
}
function isTypeReference(type) {
  return isObjectType(type) && isObjectFlagSet(type, ts13.ObjectFlags.Reference);
}

// src/types/typeGuards/compound.ts
function isFreshableIntrinsicType(type) {
  return isIntrinsicType(type) && isFreshableType(type);
}
function isTupleTypeReference(type) {
  return isTypeReference(type) && isTupleType(type.target);
}

// src/types/typeGuards/literal.ts
import ts14 from "typescript";
function isBooleanLiteralType(type) {
  return isTypeFlagSet(type, ts14.TypeFlags.BooleanLiteral);
}
function isBigIntLiteralType(type) {
  return isTypeFlagSet(type, ts14.TypeFlags.BigIntLiteral);
}
function isFalseLiteralType(type) {
  return isBooleanLiteralType(type) && type.intrinsicName === "false";
}
function isLiteralType(type) {
  return isTypeFlagSet(type, ts14.TypeFlags.Literal);
}
function isNumberLiteralType(type) {
  return isTypeFlagSet(type, ts14.TypeFlags.NumberLiteral);
}
function isStringLiteralType(type) {
  return isTypeFlagSet(type, ts14.TypeFlags.StringLiteral);
}
function isTemplateLiteralType(type) {
  return isTypeFlagSet(type, ts14.TypeFlags.TemplateLiteral);
}
function isTrueLiteralType(type) {
  return isBooleanLiteralType(type) && type.intrinsicName === "true";
}
function isUnknownLiteralType(type) {
  return isTypeFlagSet(type, ts14.TypeFlags.Literal);
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
    if (!isNamedDeclarationWithName(declaration) || declaration.name === void 0 || !ts15.isComputedPropertyName(declaration.name)) {
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
import ts17 from "typescript";

// src/nodes/utilities.ts
import ts16 from "typescript";
function isBindableObjectDefinePropertyCall(node) {
  return node.arguments.length === 3 && isEntityNameExpression(node.arguments[0]) && isNumericOrStringLikeLiteral(node.arguments[1]) && ts16.isPropertyAccessExpression(node.expression) && node.expression.name.escapedText === "defineProperty" && ts16.isIdentifier(node.expression.expression) && node.expression.expression.escapedText === "Object";
}
function isInConstContext(node) {
  let current = node;
  while (true) {
    const parent = current.parent;
    outer:
      switch (parent.kind) {
        case ts16.SyntaxKind.TypeAssertionExpression:
        case ts16.SyntaxKind.AsExpression:
          return isConstAssertionExpression(parent);
        case ts16.SyntaxKind.PrefixUnaryExpression:
          if (current.kind !== ts16.SyntaxKind.NumericLiteral)
            return false;
          switch (parent.operator) {
            case ts16.SyntaxKind.PlusToken:
            case ts16.SyntaxKind.MinusToken:
              current = parent;
              break outer;
            default:
              return false;
          }
        case ts16.SyntaxKind.PropertyAssignment:
          if (parent.initializer !== current)
            return false;
          current = parent.parent;
          break;
        case ts16.SyntaxKind.ShorthandPropertyAssignment:
          current = parent.parent;
          break;
        case ts16.SyntaxKind.ParenthesizedExpression:
        case ts16.SyntaxKind.ArrayLiteralExpression:
        case ts16.SyntaxKind.ObjectLiteralExpression:
        case ts16.SyntaxKind.TemplateExpression:
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
    ts17.TypeFlags.Undefined | ts17.TypeFlags.Null | ts17.TypeFlags.Void
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
    if (prop.flags & ts17.SymbolFlags.Transient) {
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
    (isSymbolFlagSet(prop, ts17.SymbolFlags.ValueModule) || // we unwrapped every mapped type, now we can check the actual declarations
    symbolHasReadonlyDeclaration(prop, typeChecker));
  });
}
function isReadonlyPropertyFromMappedType(type, name, typeChecker) {
  if (!isObjectType(type) || !isObjectFlagSet(type, ts17.ObjectFlags.Mapped))
    return;
  const declaration = type.symbol.declarations[0];
  if (declaration.readonlyToken !== void 0 && !/^__@[^@]+$/.test(name))
    return declaration.readonlyToken.kind !== ts17.SyntaxKind.MinusToken;
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
      const index = (isNumericPropertyName(name) ? typeChecker.getIndexInfoOfType(subType, ts17.IndexKind.Number) : void 0) ?? typeChecker.getIndexInfoOfType(subType, ts17.IndexKind.String);
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
  const writableType = writableProp.valueDeclaration !== void 0 && ts17.isPropertyAssignment(writableProp.valueDeclaration) ? typeChecker.getTypeAtLocation(writableProp.valueDeclaration.initializer) : typeChecker.getTypeOfSymbolAtLocation(writableProp, node.arguments[2]);
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
  return !!((symbol.flags & ts17.SymbolFlags.Accessor) === ts17.SymbolFlags.GetAccessor || symbol.declarations?.some(
    (node) => isModifierFlagSet(node, ts17.ModifierFlags.Readonly) || ts17.isVariableDeclaration(node) && isNodeFlagSet(node.parent, ts17.NodeFlags.Const) || ts17.isCallExpression(node) && isReadonlyAssignmentDeclaration(node, typeChecker) || ts17.isEnumMember(node) || (ts17.isPropertyAssignment(node) || ts17.isShorthandPropertyAssignment(node)) && isInConstContext(node.parent)
  ));
}
function unionTypeParts(type) {
  return isUnionType(type) ? type.types : [type];
}

// src/usage/UsageWalker.ts
import ts23 from "typescript";

// src/usage/declarations.ts
import ts19 from "typescript";

// src/usage/utils.ts
import ts18 from "typescript";
function identifierToKeywordKind(node) {
  return "identifierToKeywordKind" in ts18 ? ts18.identifierToKeywordKind(node) : (
    // eslint-disable-next-line deprecation/deprecation
    node.originalKeywordKind
  );
}
function canHaveDecorators(node) {
  return "canHaveDecorators" in ts18 ? ts18.canHaveDecorators(node) : "decorators" in node;
}
function getDecorators(node) {
  return "getDecorators" in ts18 ? ts18.getDecorators(node) : node.decorators;
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
    case ts19.SyntaxKind.TypeParameter:
    case ts19.SyntaxKind.InterfaceDeclaration:
    case ts19.SyntaxKind.TypeAliasDeclaration:
      return 2 /* Type */;
    case ts19.SyntaxKind.ClassDeclaration:
    case ts19.SyntaxKind.ClassExpression:
      return 2 /* Type */ | 4 /* Value */;
    case ts19.SyntaxKind.EnumDeclaration:
      return 7 /* Any */;
    case ts19.SyntaxKind.NamespaceImport:
    case ts19.SyntaxKind.ImportClause:
      return 7 /* Any */ | 8 /* Import */;
    case ts19.SyntaxKind.ImportEqualsDeclaration:
    case ts19.SyntaxKind.ImportSpecifier:
      return node.parent.name === node ? 7 /* Any */ | 8 /* Import */ : void 0;
    case ts19.SyntaxKind.ModuleDeclaration:
      return 1 /* Namespace */;
    case ts19.SyntaxKind.Parameter:
      if (node.parent.parent.kind === ts19.SyntaxKind.IndexSignature || identifierToKeywordKind(node) === ts19.SyntaxKind.ThisKeyword)
        return;
    case ts19.SyntaxKind.BindingElement:
    case ts19.SyntaxKind.VariableDeclaration:
      return node.parent.name === node ? 4 /* Value */ : void 0;
    case ts19.SyntaxKind.FunctionDeclaration:
    case ts19.SyntaxKind.FunctionExpression:
      return 4 /* Value */;
  }
}

// src/usage/getPropertyName.ts
import ts20 from "typescript";
function unwrapParentheses(node) {
  while (node.kind === ts20.SyntaxKind.ParenthesizedExpression)
    node = node.expression;
  return node;
}
function getPropertyName(propertyName) {
  if (propertyName.kind === ts20.SyntaxKind.ComputedPropertyName) {
    const expression = unwrapParentheses(propertyName.expression);
    if (ts20.isPrefixUnaryExpression(expression)) {
      let negate = false;
      switch (expression.operator) {
        case ts20.SyntaxKind.MinusToken:
          negate = true;
        case ts20.SyntaxKind.PlusToken:
          return ts20.isNumericLiteral(expression.operand) ? `${negate ? "-" : ""}${expression.operand.text}` : ts20.isBigIntLiteral(expression.operand) ? `${negate ? "-" : ""}${expression.operand.text.slice(0, -1)}` : void 0;
        default:
          return;
      }
    }
    if (ts20.isBigIntLiteral(expression))
      return expression.text.slice(0, -1);
    if (isNumericOrStringLikeLiteral(expression))
      return expression.text;
    return;
  }
  return propertyName.kind === ts20.SyntaxKind.PrivateIdentifier ? void 0 : propertyName.text;
}

// src/usage/getUsageDomain.ts
import ts21 from "typescript";
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
    case ts21.SyntaxKind.TypeReference:
      return identifierToKeywordKind(node) !== ts21.SyntaxKind.ConstKeyword ? 2 /* Type */ : void 0;
    case ts21.SyntaxKind.ExpressionWithTypeArguments:
      return parent.parent.token === ts21.SyntaxKind.ImplementsKeyword || parent.parent.parent.kind === ts21.SyntaxKind.InterfaceDeclaration ? 2 /* Type */ : 4 /* Value */;
    case ts21.SyntaxKind.TypeQuery:
      return 5 /* ValueOrNamespace */ | 8 /* TypeQuery */;
    case ts21.SyntaxKind.QualifiedName:
      if (parent.left === node) {
        if (getEntityNameParent(parent).kind === ts21.SyntaxKind.TypeQuery)
          return 1 /* Namespace */ | 8 /* TypeQuery */;
        return 1 /* Namespace */;
      }
      break;
    case ts21.SyntaxKind.ExportSpecifier:
      if (parent.propertyName === void 0 || parent.propertyName === node)
        return 7 /* Any */;
      break;
    case ts21.SyntaxKind.ExportAssignment:
      return 7 /* Any */;
    case ts21.SyntaxKind.BindingElement:
      if (parent.initializer === node)
        return 5 /* ValueOrNamespace */;
      break;
    case ts21.SyntaxKind.Parameter:
    case ts21.SyntaxKind.EnumMember:
    case ts21.SyntaxKind.PropertyDeclaration:
    case ts21.SyntaxKind.VariableDeclaration:
    case ts21.SyntaxKind.PropertyAssignment:
    case ts21.SyntaxKind.PropertyAccessExpression:
    case ts21.SyntaxKind.ImportEqualsDeclaration:
      if (parent.name !== node)
        return 5 /* ValueOrNamespace */;
      break;
    case ts21.SyntaxKind.JsxAttribute:
    case ts21.SyntaxKind.FunctionDeclaration:
    case ts21.SyntaxKind.FunctionExpression:
    case ts21.SyntaxKind.NamespaceImport:
    case ts21.SyntaxKind.ClassDeclaration:
    case ts21.SyntaxKind.ClassExpression:
    case ts21.SyntaxKind.ModuleDeclaration:
    case ts21.SyntaxKind.MethodDeclaration:
    case ts21.SyntaxKind.EnumDeclaration:
    case ts21.SyntaxKind.GetAccessor:
    case ts21.SyntaxKind.SetAccessor:
    case ts21.SyntaxKind.LabeledStatement:
    case ts21.SyntaxKind.BreakStatement:
    case ts21.SyntaxKind.ContinueStatement:
    case ts21.SyntaxKind.ImportClause:
    case ts21.SyntaxKind.ImportSpecifier:
    case ts21.SyntaxKind.TypePredicate:
    case ts21.SyntaxKind.MethodSignature:
    case ts21.SyntaxKind.PropertySignature:
    case ts21.SyntaxKind.NamespaceExportDeclaration:
    case ts21.SyntaxKind.NamespaceExport:
    case ts21.SyntaxKind.InterfaceDeclaration:
    case ts21.SyntaxKind.TypeAliasDeclaration:
    case ts21.SyntaxKind.TypeParameter:
    case ts21.SyntaxKind.NamedTupleMember:
      break;
    default:
      return 5 /* ValueOrNamespace */;
  }
}
function getEntityNameParent(name) {
  let parent = name.parent;
  while (parent.kind === ts21.SyntaxKind.QualifiedName)
    parent = parent.parent;
  return parent;
}

// src/usage/Scope.ts
import ts22 from "typescript";
function isBlockScopeBoundary(node) {
  switch (node.kind) {
    case ts22.SyntaxKind.Block: {
      const parent = node.parent;
      return parent.kind !== ts22.SyntaxKind.CatchClause && // blocks inside SourceFile are block scope boundaries
      (parent.kind === ts22.SyntaxKind.SourceFile || // blocks that are direct children of a function scope boundary are no scope boundary
      // for example the FunctionBlock is part of the function scope of the containing function
      !isFunctionScopeBoundary(parent)) ? 2 /* Block */ : 0 /* None */;
    }
    case ts22.SyntaxKind.ForStatement:
    case ts22.SyntaxKind.ForInStatement:
    case ts22.SyntaxKind.ForOfStatement:
    case ts22.SyntaxKind.CaseBlock:
    case ts22.SyntaxKind.CatchClause:
    case ts22.SyntaxKind.WithStatement:
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
    const isModule = ts23.isExternalModule(sourceFile);
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
        case ts23.SyntaxKind.ClassExpression:
          return continueWithScope(
            node,
            node.name !== void 0 ? new ClassExpressionScope(
              node.name,
              __privateGet(this, _scope)
            ) : new NonRootScope(__privateGet(this, _scope), 1 /* Function */)
          );
        case ts23.SyntaxKind.ClassDeclaration:
          __privateMethod(this, _handleDeclaration, handleDeclaration_fn).call(this, node, true, 4 /* Value */ | 2 /* Type */);
          return continueWithScope(
            node,
            new NonRootScope(__privateGet(this, _scope), 1 /* Function */)
          );
        case ts23.SyntaxKind.InterfaceDeclaration:
        case ts23.SyntaxKind.TypeAliasDeclaration:
          __privateMethod(this, _handleDeclaration, handleDeclaration_fn).call(this, node, true, 2 /* Type */);
          return continueWithScope(
            node,
            new NonRootScope(__privateGet(this, _scope), 4 /* Type */)
          );
        case ts23.SyntaxKind.EnumDeclaration:
          __privateMethod(this, _handleDeclaration, handleDeclaration_fn).call(this, node, true, 7 /* Any */);
          return continueWithScope(
            node,
            __privateGet(this, _scope).createOrReuseEnumScope(
              node.name.text,
              includesModifier(
                node.modifiers,
                ts23.SyntaxKind.ExportKeyword
              )
            )
          );
        case ts23.SyntaxKind.ModuleDeclaration:
          return __privateMethod(this, _handleModule, handleModule_fn).call(this, node, continueWithScope);
        case ts23.SyntaxKind.MappedType:
          return continueWithScope(
            node,
            new NonRootScope(__privateGet(this, _scope), 4 /* Type */)
          );
        case ts23.SyntaxKind.FunctionExpression:
        case ts23.SyntaxKind.ArrowFunction:
        case ts23.SyntaxKind.Constructor:
        case ts23.SyntaxKind.MethodDeclaration:
        case ts23.SyntaxKind.FunctionDeclaration:
        case ts23.SyntaxKind.GetAccessor:
        case ts23.SyntaxKind.SetAccessor:
        case ts23.SyntaxKind.MethodSignature:
        case ts23.SyntaxKind.CallSignature:
        case ts23.SyntaxKind.ConstructSignature:
        case ts23.SyntaxKind.ConstructorType:
        case ts23.SyntaxKind.FunctionType:
          return __privateMethod(this, _handleFunctionLikeDeclaration, handleFunctionLikeDeclaration_fn).call(this, node, cb, variableCallback);
        case ts23.SyntaxKind.ConditionalType:
          return __privateMethod(this, _handleConditionalType, handleConditionalType_fn).call(this, node, cb, variableCallback);
        case ts23.SyntaxKind.VariableDeclarationList:
          __privateMethod(this, _handleVariableDeclaration, handleVariableDeclaration_fn).call(this, node);
          break;
        case ts23.SyntaxKind.Parameter:
          if (node.parent.kind !== ts23.SyntaxKind.IndexSignature && (node.name.kind !== ts23.SyntaxKind.Identifier || identifierToKeywordKind(
            node.name
          ) !== ts23.SyntaxKind.ThisKeyword))
            __privateMethod(this, _handleBindingName, handleBindingName_fn).call(this, node.name, false, false);
          break;
        case ts23.SyntaxKind.EnumMember:
          __privateGet(this, _scope).addVariable(
            getPropertyName(node.name),
            node.name,
            1 /* Function */,
            true,
            4 /* Value */
          );
          break;
        case ts23.SyntaxKind.ImportClause:
        case ts23.SyntaxKind.ImportSpecifier:
        case ts23.SyntaxKind.NamespaceImport:
        case ts23.SyntaxKind.ImportEqualsDeclaration:
          __privateMethod(this, _handleDeclaration, handleDeclaration_fn).call(this, node, false, 7 /* Any */ | 8 /* Import */);
          break;
        case ts23.SyntaxKind.TypeParameter:
          __privateGet(this, _scope).addVariable(
            node.name.text,
            node.name,
            node.parent.kind === ts23.SyntaxKind.InferType ? 8 /* InferType */ : 7 /* Type */,
            false,
            2 /* Type */
          );
          break;
        case ts23.SyntaxKind.ExportSpecifier:
          if (node.propertyName !== void 0)
            return __privateGet(this, _scope).markExported(
              node.propertyName,
              node.name
            );
          return __privateGet(this, _scope).markExported(node.name);
        case ts23.SyntaxKind.ExportAssignment:
          if (node.expression.kind === ts23.SyntaxKind.Identifier)
            return __privateGet(this, _scope).markExported(
              node.expression
            );
          break;
        case ts23.SyntaxKind.Identifier: {
          const domain = getUsageDomain(node);
          if (domain !== void 0)
            __privateGet(this, _scope).addUse({ domain, location: node });
          return;
        }
      }
      return ts23.forEachChild(node, cb);
    };
    const continueWithScope = (node, scope, next = forEachChild) => {
      const savedScope = __privateGet(this, _scope);
      __privateSet(this, _scope, scope);
      next(node);
      __privateGet(this, _scope).end(variableCallback);
      __privateSet(this, _scope, savedScope);
    };
    const handleBlockScope = (node) => {
      if (node.kind === ts23.SyntaxKind.CatchClause && node.variableDeclaration !== void 0)
        __privateMethod(this, _handleBindingName, handleBindingName_fn).call(this, node.variableDeclaration.name, true, false);
      return ts23.forEachChild(node, cb);
    };
    ts23.forEachChild(sourceFile, cb);
    __privateGet(this, _scope).end(variableCallback);
    return __privateGet(this, _result);
    function forEachChild(node) {
      return ts23.forEachChild(node, cb);
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
  if (node.kind === ts23.SyntaxKind.FunctionDeclaration)
    __privateMethod(this, _handleDeclaration, handleDeclaration_fn).call(this, node, false, 4 /* Value */);
  const scope = __privateSet(this, _scope, node.kind === ts23.SyntaxKind.FunctionExpression && node.name !== void 0 ? new FunctionExpressionScope(node.name, savedScope) : new FunctionScope(savedScope));
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
  if (node.flags & ts23.NodeFlags.GlobalAugmentation)
    return next(
      node,
      __privateGet(this, _scope).createOrReuseNamespaceScope("-global", false, true, false)
    );
  if (node.name.kind === ts23.SyntaxKind.Identifier) {
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
      ts23.SyntaxKind.DeclareKeyword
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
        ts23.SyntaxKind.ExportKeyword
      ),
      domain
    );
};
_handleBindingName = new WeakSet();
handleBindingName_fn = function(name, blockScoped, exported) {
  if (name.kind === ts23.SyntaxKind.Identifier)
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
  const exported = declarationList.parent.kind === ts23.SyntaxKind.VariableStatement && includesModifier(
    declarationList.parent.modifiers,
    ts23.SyntaxKind.ExportKeyword
  );
  for (const declaration of declarationList.declarations)
    __privateMethod(this, _handleBindingName, handleBindingName_fn).call(this, declaration.name, blockScoped, exported);
};
function isNamespaceExported(node) {
  return node.parent.kind === ts23.SyntaxKind.ModuleDeclaration || includesModifier(node.modifiers, ts23.SyntaxKind.ExportKeyword);
}
function namespaceHasExportStatement(ns) {
  if (ns.body === void 0 || ns.body.kind !== ts23.SyntaxKind.ModuleBlock)
    return false;
  return containsExportStatement(ns.body);
}
function containsExportStatement(block) {
  for (const statement of block.statements)
    if (statement.kind === ts23.SyntaxKind.ExportDeclaration || statement.kind === ts23.SyntaxKind.ExportAssignment)
      return true;
  return false;
}
function isBlockScopedVariableDeclarationList(declarationList) {
  return (declarationList.flags & ts23.NodeFlags.BlockScoped) !== 0;
}
function forEachDestructuringIdentifier(pattern, fn) {
  for (const element of pattern.elements) {
    if (element.kind !== ts23.SyntaxKind.BindingElement)
      continue;
    let result;
    if (element.name.kind === ts23.SyntaxKind.Identifier) {
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
export {
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
};
