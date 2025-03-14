"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCssClassNames = parseCssClassNames;
const parseCssVars_1 = require("./parseCssVars");
const cssClassNameReg = /(?=([\.]{1}[a-zA-Z_]+[\w\_\-]*)[\s\.\,\+\{\>#\:]{1})/g;
function* parseCssClassNames(styleContent) {
    styleContent = (0, parseCssVars_1.clearComments)(styleContent);
    const matches = styleContent.matchAll(cssClassNameReg);
    for (const match of matches) {
        if (match.index !== undefined) {
            const matchText = match[1];
            if (matchText !== undefined) {
                yield { offset: match.index, text: matchText };
            }
        }
    }
}
//# sourceMappingURL=parseCssClassNames.js.map