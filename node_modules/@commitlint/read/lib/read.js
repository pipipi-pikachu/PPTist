"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const minimist_1 = __importDefault(require("minimist"));
const get_history_commits_1 = require("./get-history-commits");
const get_edit_commit_1 = require("./get-edit-commit");
// Get commit messages
async function getCommitMessages(settings) {
    const { cwd, from, to, edit, gitLogArgs } = settings;
    if (edit) {
        return (0, get_edit_commit_1.getEditCommit)(cwd, edit);
    }
    let gitOptions = { from, to };
    if (gitLogArgs) {
        gitOptions = Object.assign(Object.assign({}, (0, minimist_1.default)(gitLogArgs.split(' '))), { from,
            to });
    }
    return (0, get_history_commits_1.getHistoryCommits)(gitOptions, { cwd });
}
exports.default = getCommitMessages;
//# sourceMappingURL=read.js.map