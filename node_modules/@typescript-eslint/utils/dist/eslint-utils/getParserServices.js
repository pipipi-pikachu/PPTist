"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParserServices = void 0;
const ERROR_MESSAGE = 'You have used a rule which requires parserServices to be generated. You must therefore provide a value for the "parserOptions.project" property for @typescript-eslint/parser.';
function getParserServices(context, allowWithoutFullTypeInformation = false) {
    // This check is unnecessary if the user is using the latest version of our parser.
    //
    // However the world isn't perfect:
    // - Users often use old parser versions.
    //   Old versions of the parser would not return any parserServices unless parserOptions.project was set.
    // - Users sometimes use parsers that aren't @typescript-eslint/parser
    //   Other parsers won't return the parser services we expect (if they return any at all).
    //
    // This check allows us to handle bad user setups whilst providing a nice user-facing
    // error message explaining the problem.
    if (
    // eslint-disable-next-line deprecation/deprecation -- TODO - support for ESLint v9 with backwards-compatible support for ESLint v8
    context.parserServices?.esTreeNodeToTSNodeMap == null ||
        // eslint-disable-next-line deprecation/deprecation, @typescript-eslint/no-unnecessary-condition -- TODO - support for ESLint v9 with backwards-compatible support for ESLint v8
        context.parserServices.tsNodeToESTreeNodeMap == null) {
        throw new Error(ERROR_MESSAGE);
    }
    // if a rule requires full type information, then hard fail if it doesn't exist
    // this forces the user to supply parserOptions.project
    if (
    // eslint-disable-next-line deprecation/deprecation -- TODO - support for ESLint v9 with backwards-compatible support for ESLint v8
    context.parserServices.program == null &&
        !allowWithoutFullTypeInformation) {
        throw new Error(ERROR_MESSAGE);
    }
    // eslint-disable-next-line deprecation/deprecation -- TODO - support for ESLint v9 with backwards-compatible support for ESLint v8
    return context.parserServices;
}
exports.getParserServices = getParserServices;
//# sourceMappingURL=getParserServices.js.map