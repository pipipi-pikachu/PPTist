"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parseSfc_1 = require("../utils/parseSfc");
const jsxWrapper = ['<script setup lang="jsx">\n', '\n</script>'];
const tsxWrapper = ['<script setup lang="tsx">\n', '\n</script>'];
const plugin = _ctx => {
    return {
        version: 2.1,
        isValidFile(fileName) {
            return fileName.endsWith('.setup.jsx') || fileName.endsWith('.setup.tsx');
        },
        parseSFC2(fileName, _languageId, content) {
            if (fileName.endsWith('.setup.jsx')) {
                console.log('[Vue] parseSFC2', fileName);
                return patchSFC((0, parseSfc_1.parse)(`${jsxWrapper[0]}${content}${jsxWrapper[1]}`));
            }
            if (fileName.endsWith('.setup.tsx')) {
                console.log('[Vue] parseSFC2', fileName);
                return patchSFC((0, parseSfc_1.parse)(`${tsxWrapper[0]}${content}${tsxWrapper[1]}`));
            }
        },
    };
};
exports.default = plugin;
function patchSFC(sfc) {
    sfc.descriptor.scriptSetup.loc.start.column -= jsxWrapper[0].length;
    sfc.descriptor.scriptSetup.loc.start.offset -= jsxWrapper[0].length;
    sfc.descriptor.scriptSetup.loc.end.offset -= jsxWrapper[0].length;
    if (sfc.descriptor.scriptSetup.loc.end.line === sfc.descriptor.scriptSetup.loc.start.line) {
        sfc.descriptor.scriptSetup.loc.end.column -= jsxWrapper[0].length;
    }
    return sfc;
}
//# sourceMappingURL=file-dot-setup.js.map