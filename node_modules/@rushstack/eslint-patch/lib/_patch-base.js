"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.isModuleResolutionError = exports.ESLINT_MAJOR_VERSION = exports.Naming = exports.ModuleResolver = exports.ConfigArrayFactory = exports.eslintFolder = void 0;
// This is a workaround for https://github.com/eslint/eslint/issues/3458
//
// To correct how ESLint searches for plugin packages, add this line to the top of your project's .eslintrc.js file:
//
//    require("@rushstack/eslint-patch/modern-module-resolution");
//
const path = require('path');
const fs = require('fs');
const isModuleResolutionError = (ex) => typeof ex === 'object' && !!ex && 'code' in ex && ex.code === 'MODULE_NOT_FOUND';
exports.isModuleResolutionError = isModuleResolutionError;
// Module path for eslintrc.cjs
// Example: ".../@eslint/eslintrc/dist/eslintrc.cjs"
let eslintrcBundlePath = undefined;
// Module path for config-array-factory.js
// Example: ".../@eslint/eslintrc/lib/config-array-factory"
let configArrayFactoryPath = undefined;
// Module path for relative-module-resolver.js
// Example: ".../@eslint/eslintrc/lib/shared/relative-module-resolver"
let moduleResolverPath = undefined;
// Module path for naming.js
// Example: ".../@eslint/eslintrc/lib/shared/naming"
let namingPath = undefined;
// Folder path where ESLint's package.json can be found
// Example: ".../node_modules/eslint"
let eslintFolder = undefined;
exports.eslintFolder = eslintFolder;
// Probe for the ESLint >=8.0.0 layout:
for (let currentModule = module;;) {
    if (!eslintrcBundlePath) {
        if (currentModule.filename.endsWith('eslintrc.cjs')) {
            // For ESLint >=8.0.0, all @eslint/eslintrc code is bundled at this path:
            //   .../@eslint/eslintrc/dist/eslintrc.cjs
            try {
                const eslintrcFolder = path.dirname(require.resolve('@eslint/eslintrc/package.json', { paths: [currentModule.path] }));
                // Make sure we actually resolved the module in our call path
                // and not some other spurious dependency.
                const resolvedEslintrcBundlePath = path.join(eslintrcFolder, 'dist/eslintrc.cjs');
                if (resolvedEslintrcBundlePath === currentModule.filename) {
                    eslintrcBundlePath = resolvedEslintrcBundlePath;
                }
            }
            catch (ex) {
                // Module resolution failures are expected, as we're walking
                // up our require stack to look for eslint. All other errors
                // are rethrown.
                if (!isModuleResolutionError(ex)) {
                    throw ex;
                }
            }
        }
    }
    else {
        // Next look for a file in ESLint's folder
        //   .../eslint/lib/cli-engine/cli-engine.js
        try {
            const eslintCandidateFolder = path.dirname(require.resolve('eslint/package.json', {
                paths: [currentModule.path]
            }));
            // Make sure we actually resolved the module in our call path
            // and not some other spurious dependency.
            if (currentModule.filename.startsWith(eslintCandidateFolder + path.sep)) {
                exports.eslintFolder = eslintFolder = eslintCandidateFolder;
                break;
            }
        }
        catch (ex) {
            // Module resolution failures are expected, as we're walking
            // up our require stack to look for eslint. All other errors
            // are rethrown.
            if (!isModuleResolutionError(ex)) {
                throw ex;
            }
        }
    }
    if (!currentModule.parent) {
        break;
    }
    currentModule = currentModule.parent;
}
if (!eslintFolder) {
    // Probe for the ESLint >=7.12.0 layout:
    for (let currentModule = module;;) {
        if (!configArrayFactoryPath) {
            // For ESLint >=7.12.0, config-array-factory.js is at this path:
            //   .../@eslint/eslintrc/lib/config-array-factory.js
            try {
                const eslintrcFolder = path.dirname(require.resolve('@eslint/eslintrc/package.json', {
                    paths: [currentModule.path]
                }));
                const resolvedConfigArrayFactoryPath = path.join(eslintrcFolder, '/lib/config-array-factory.js');
                if (resolvedConfigArrayFactoryPath === currentModule.filename) {
                    configArrayFactoryPath = resolvedConfigArrayFactoryPath;
                    moduleResolverPath = `${eslintrcFolder}/lib/shared/relative-module-resolver`;
                    namingPath = `${eslintrcFolder}/lib/shared/naming`;
                }
            }
            catch (ex) {
                // Module resolution failures are expected, as we're walking
                // up our require stack to look for eslint. All other errors
                // are rethrown.
                if (!isModuleResolutionError(ex)) {
                    throw ex;
                }
            }
        }
        else if (currentModule.filename.endsWith('cli-engine.js')) {
            // Next look for a file in ESLint's folder
            //   .../eslint/lib/cli-engine/cli-engine.js
            try {
                const eslintCandidateFolder = path.dirname(require.resolve('eslint/package.json', {
                    paths: [currentModule.path]
                }));
                if (path.join(eslintCandidateFolder, 'lib/cli-engine/cli-engine.js') == currentModule.filename) {
                    exports.eslintFolder = eslintFolder = eslintCandidateFolder;
                    break;
                }
            }
            catch (ex) {
                // Module resolution failures are expected, as we're walking
                // up our require stack to look for eslint. All other errors
                // are rethrown.
                if (!isModuleResolutionError(ex)) {
                    throw ex;
                }
            }
        }
        if (!currentModule.parent) {
            break;
        }
        currentModule = currentModule.parent;
    }
}
if (!eslintFolder) {
    // Probe for the <7.12.0 layout:
    for (let currentModule = module;;) {
        // For ESLint <7.12.0, config-array-factory.js was at this path:
        //   .../eslint/lib/cli-engine/config-array-factory.js
        if (/[\\/]eslint[\\/]lib[\\/]cli-engine[\\/]config-array-factory\.js$/i.test(currentModule.filename)) {
            exports.eslintFolder = eslintFolder = path.join(path.dirname(currentModule.filename), '../..');
            configArrayFactoryPath = `${eslintFolder}/lib/cli-engine/config-array-factory`;
            moduleResolverPath = `${eslintFolder}/lib/shared/relative-module-resolver`;
            // The naming module was moved to @eslint/eslintrc in ESLint 7.8.0, which is also when the @eslint/eslintrc
            // package was created and added to ESLint, so we need to probe for whether it's in the old or new location.
            let eslintrcFolder;
            try {
                eslintrcFolder = path.dirname(require.resolve('@eslint/eslintrc/package.json', {
                    paths: [currentModule.path]
                }));
            }
            catch (ex) {
                if (!isModuleResolutionError(ex)) {
                    throw ex;
                }
            }
            namingPath = `${eslintrcFolder !== null && eslintrcFolder !== void 0 ? eslintrcFolder : eslintFolder}/lib/shared/naming`;
            break;
        }
        if (!currentModule.parent) {
            // This was tested with ESLint 6.1.0 .. 7.12.1.
            throw new Error('Failed to patch ESLint because the calling module was not recognized.\n' +
                'If you are using a newer ESLint version that may be unsupported, please create a GitHub issue:\n' +
                'https://github.com/microsoft/rushstack/issues');
        }
        currentModule = currentModule.parent;
    }
}
// Detect the ESLint package version
const eslintPackageJsonPath = `${eslintFolder}/package.json`;
const eslintPackageJson = fs.readFileSync(eslintPackageJsonPath).toString();
const eslintPackageObject = JSON.parse(eslintPackageJson);
const eslintPackageVersion = eslintPackageObject.version;
const eslintMajorVersion = parseInt(eslintPackageVersion, 10);
exports.ESLINT_MAJOR_VERSION = eslintMajorVersion;
if (isNaN(eslintMajorVersion)) {
    throw new Error(`Unable to parse ESLint version "${eslintPackageVersion}" in file "${eslintPackageJsonPath}"`);
}
if (!(eslintMajorVersion >= 6 && eslintMajorVersion <= 8)) {
    throw new Error('The ESLint patch script has only been tested with ESLint version 6.x, 7.x, and 8.x.' +
        ` (Your version: ${eslintPackageVersion})\n` +
        'Consider reporting a GitHub issue:\n' +
        'https://github.com/microsoft/rushstack/issues');
}
let ConfigArrayFactory;
exports.ConfigArrayFactory = ConfigArrayFactory;
if (eslintMajorVersion === 8) {
    exports.ConfigArrayFactory = ConfigArrayFactory = require(eslintrcBundlePath).Legacy.ConfigArrayFactory;
}
else {
    exports.ConfigArrayFactory = ConfigArrayFactory = require(configArrayFactoryPath).ConfigArrayFactory;
}
let ModuleResolver;
exports.ModuleResolver = ModuleResolver;
let Naming;
exports.Naming = Naming;
if (eslintMajorVersion === 8) {
    exports.ModuleResolver = ModuleResolver = require(eslintrcBundlePath).Legacy.ModuleResolver;
    exports.Naming = Naming = require(eslintrcBundlePath).Legacy.naming;
}
else {
    exports.ModuleResolver = ModuleResolver = require(moduleResolverPath);
    exports.Naming = Naming = require(namingPath);
}
//# sourceMappingURL=_patch-base.js.map