"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const { sync } = require('conventional-commits-parser');
const defaultChangelogOpts = require('conventional-changelog-angular');
async function parse(message, parser = sync, parserOpts) {
    const preset = await defaultChangelogOpts();
    const defaultOpts = preset.parserOpts;
    const opts = Object.assign(Object.assign(Object.assign({}, defaultOpts), { fieldPattern: null }), (parserOpts || {}));
    const parsed = parser(message, opts);
    parsed.raw = message;
    return parsed;
}
exports.parse = parse;
exports.default = parse;
//# sourceMappingURL=index.js.map