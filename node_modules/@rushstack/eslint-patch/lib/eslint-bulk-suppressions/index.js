"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
const _patch_base_1 = require("../_patch-base");
const path_utils_1 = require("./path-utils");
const bulk_suppressions_patch_1 = require("./bulk-suppressions-patch");
const generate_patched_file_1 = require("./generate-patched-file");
if (!_patch_base_1.eslintFolder) {
    console.error('@rushstack/eslint-patch/eslint-bulk-suppressions: Could not find ESLint installation to patch.');
    process.exit(1);
}
if (process.env._RUSHSTACK_ESLINT_BULK_DETECT === 'true') {
    (0, path_utils_1.findAndConsoleLogPatchPathCli)(__dirname);
    process.exit(0);
}
const pathToLinterJS = (0, path_utils_1.getPathToLinterJS)();
const nameOfGeneratedPatchFile = (0, path_utils_1.getNameOfGeneratedPatchFile)();
const pathToGeneratedPatch = (0, path_utils_1.getPathToGeneratedPatch)(__dirname, nameOfGeneratedPatchFile);
(0, generate_patched_file_1.generatePatchedFileIfDoesntExist)(pathToLinterJS, pathToGeneratedPatch);
const { Linter: LinterPatch } = require(pathToGeneratedPatch);
const { Linter } = require(pathToLinterJS);
(0, bulk_suppressions_patch_1.patchClass)(Linter, LinterPatch);
//# sourceMappingURL=index.js.map