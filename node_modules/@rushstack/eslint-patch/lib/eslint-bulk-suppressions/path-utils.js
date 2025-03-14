"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNameOfGeneratedPatchFile = exports.getPathToGeneratedPatch = exports.getPathToLinterJS = exports.findAndConsoleLogPatchPathCli = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const _patch_base_1 = require("../_patch-base");
function findAndConsoleLogPatchPathCli(patchPath) {
    if (process.env._RUSHSTACK_ESLINT_BULK_DETECT !== 'true') {
        return;
    }
    const startDelimiter = 'RUSHSTACK_ESLINT_BULK_START';
    const endDelimiter = 'RUSHSTACK_ESLINT_BULK_END';
    const configuration = {
        /**
         * `@rushtack/eslint`-bulk should report an error if its package.json is older than this number
         */
        minCliVersion: '0.0.0',
        /**
         * `@rushtack/eslint-bulk` will invoke this entry point
         */
        cliEntryPoint: path_1.default.resolve(patchPath, '..', 'exports', 'eslint-bulk.js')
    };
    console.log(startDelimiter + JSON.stringify(configuration) + endDelimiter);
}
exports.findAndConsoleLogPatchPathCli = findAndConsoleLogPatchPathCli;
function getPathToLinterJS() {
    if (!_patch_base_1.eslintFolder) {
        throw new Error('Cannot find ESLint installation to patch.');
    }
    return path_1.default.join(_patch_base_1.eslintFolder, 'lib', 'linter', 'linter.js');
}
exports.getPathToLinterJS = getPathToLinterJS;
function getPathToGeneratedPatch(patchPath, nameOfGeneratedPatchFile) {
    fs_1.default.mkdirSync(path_1.default.join(patchPath, 'temp', 'patches'), { recursive: true });
    const pathToGeneratedPatch = path_1.default.join(patchPath, 'temp', 'patches', nameOfGeneratedPatchFile);
    return pathToGeneratedPatch;
}
exports.getPathToGeneratedPatch = getPathToGeneratedPatch;
function getEslintPackageVersion() {
    if (!_patch_base_1.eslintFolder) {
        throw new Error('Cannot find ESLint installation to patch.');
    }
    const eslintPackageJsonPath = path_1.default.join(_patch_base_1.eslintFolder, 'package.json');
    const eslintPackageJson = fs_1.default.readFileSync(eslintPackageJsonPath).toString();
    const eslintPackageObject = JSON.parse(eslintPackageJson);
    const eslintPackageVersion = eslintPackageObject.version;
    return eslintPackageVersion;
}
function getNameOfGeneratedPatchFile() {
    const eslintPackageVersion = getEslintPackageVersion();
    const nameOfGeneratedPatchFile = `linter-patch-v${eslintPackageVersion}.js`;
    return nameOfGeneratedPatchFile;
}
exports.getNameOfGeneratedPatchFile = getNameOfGeneratedPatchFile;
//# sourceMappingURL=path-utils.js.map