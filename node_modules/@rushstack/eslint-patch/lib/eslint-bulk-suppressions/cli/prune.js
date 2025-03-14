"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.prune = void 0;
const child_process_1 = require("child_process");
const get_eslint_cli_1 = require("./utils/get-eslint-cli");
const print_help_1 = require("./utils/print-help");
function prune() {
    const args = process.argv.slice(3);
    if (args.includes('--help') || args.includes('-h')) {
        (0, print_help_1.printPruneHelp)();
        process.exit(0);
    }
    if (args.length > 0) {
        throw new Error(`@rushstack/eslint-bulk: Unknown arguments: ${args.join(' ')}`);
    }
    const eslintCLI = (0, get_eslint_cli_1.getEslintCli)(process.cwd());
    const env = Object.assign(Object.assign({}, process.env), { ESLINT_BULK_PRUNE: 'true' });
    (0, child_process_1.exec)(`${eslintCLI} . --format=json`, { env }, (error, stdout, stderr) => {
        // if errorCount != 0, ESLint will process.exit(1) giving the false impression
        // that the exec failed, even though linting errors are to be expected
        const eslintOutputWithErrorRegex = /"errorCount":(?!0)\d+/;
        const isEslintError = error !== null && error.code === 1 && eslintOutputWithErrorRegex.test(stdout);
        if (error && !isEslintError) {
            throw new Error(`@rushstack/eslint-bulk execution error: ${error.message}`);
        }
        if (stderr) {
            throw new Error(`@rushstack/eslint-bulk ESLint errors: ${stderr}`);
        }
        console.log(`@rushstack/eslint-bulk: Successfully pruned unused suppressions in all .eslint-bulk-suppressions.json files under directory ${process.cwd()}`);
    });
}
exports.prune = prune;
//# sourceMappingURL=prune.js.map