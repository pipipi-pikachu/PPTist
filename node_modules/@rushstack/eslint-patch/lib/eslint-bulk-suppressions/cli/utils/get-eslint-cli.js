"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEslintCli = void 0;
const path_1 = __importDefault(require("path"));
const TESTED_VERSIONS = ['8.6.0', '8.7.0', '8.21.0', '8.22.0', '8.23.0', '8.23.1'];
function getEslintCli(packagePath) {
    // Try to find a local ESLint installation, the one that should be listed as a dev dependency in package.json
    // and installed in node_modules
    try {
        const localEslintApiPath = require.resolve('eslint', { paths: [packagePath] });
        const localEslintPath = path_1.default.dirname(path_1.default.dirname(localEslintApiPath));
        const eslintPackageJson = require(path_1.default.join(localEslintPath, 'package.json'));
        const localEslintVersion = eslintPackageJson.version;
        const eslintExecutable = path_1.default.join(localEslintPath, 'bin', 'eslint.js');
        if (!TESTED_VERSIONS.includes(localEslintVersion)) {
            console.warn('@rushstack/eslint-bulk: Be careful, the installed ESLint version has not been tested with eslint-bulk.');
        }
        return `node ${eslintExecutable}`;
    }
    catch (e) {
        throw new Error('@rushstack/eslint-bulk: eslint is specified as a dev dependency in package.json, but eslint-bulk cannot find it in node_modules.');
    }
}
exports.getEslintCli = getEslintCli;
//# sourceMappingURL=get-eslint-cli.js.map