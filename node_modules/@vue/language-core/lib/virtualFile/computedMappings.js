"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computedMappings = computedMappings;
const computeds_1 = require("computeds");
const muggle_string_1 = require("muggle-string");
const shared_1 = require("../plugins/shared");
function computedMappings(snapshot, sfc) {
    return (0, computeds_1.computed)(() => {
        const str = [[snapshot().getText(0, snapshot().getLength()), undefined, 0, shared_1.allCodeFeatures]];
        for (const block of [
            sfc.script,
            sfc.scriptSetup,
            sfc.template,
            ...sfc.styles,
            ...sfc.customBlocks,
        ]) {
            if (block) {
                (0, muggle_string_1.replaceSourceRange)(str, undefined, block.startTagEnd, block.endTagStart, '\n\n');
            }
        }
        const mappings = str
            .filter(s => typeof s !== 'string')
            .map(m => {
            const text = m[0];
            const start = m[2];
            return {
                sourceOffsets: [start],
                generatedOffsets: [start],
                lengths: [text.length],
                data: m[3],
            };
        });
        // fix folding range end position failed to mapping
        for (const block of [
            sfc.script,
            sfc.scriptSetup,
            sfc.template,
            ...sfc.styles,
            ...sfc.customBlocks,
        ]) {
            const offsets = [];
            if (block) {
                let content = block.content;
                if (content.endsWith('\r\n')) {
                    content = content.slice(0, -2);
                }
                else if (content.endsWith('\n')) {
                    content = content.slice(0, -1);
                }
                const offset = content.lastIndexOf('\n') + 1;
                offsets.push(block.startTagEnd + offset);
            }
            if (offsets.length) {
                mappings.push({
                    sourceOffsets: offsets,
                    generatedOffsets: offsets,
                    lengths: offsets.map(() => 0),
                    data: { structure: true },
                });
            }
        }
        return mappings;
    });
}
//# sourceMappingURL=computedMappings.js.map