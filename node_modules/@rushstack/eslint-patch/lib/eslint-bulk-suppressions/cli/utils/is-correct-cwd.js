"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCorrectCwd = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function isCorrectCwd(cwd) {
    return fs_1.default.existsSync(path_1.default.join(cwd, '.eslintrc.js')) || fs_1.default.existsSync(path_1.default.join(cwd, '.eslintrc.cjs'));
}
exports.isCorrectCwd = isCorrectCwd;
//# sourceMappingURL=is-correct-cwd.js.map