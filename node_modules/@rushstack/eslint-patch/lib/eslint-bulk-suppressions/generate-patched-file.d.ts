/**
 * Dynamically generate file to properly patch many versions of ESLint
 * @param inputFilePath Must be an iteration of https://github.com/eslint/eslint/blob/main/lib/linter/linter.js
 * @param outputFilePath Some small changes to linter.js
 */
export declare function generatePatchedFileIfDoesntExist(inputFilePath: string, outputFilePath: string): void;
//# sourceMappingURL=generate-patched-file.d.ts.map