"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VueVirtualCode = void 0;
const computeds_1 = require("computeds");
const computedFiles_1 = require("./computedFiles");
const computedMappings_1 = require("./computedMappings");
const computedSfc_1 = require("./computedSfc");
const computedVueSfc_1 = require("./computedVueSfc");
class VueVirtualCode {
    // others
    get embeddedCodes() {
        return this.getEmbeddedCodes();
    }
    get snapshot() {
        return this._snapshot();
    }
    get mappings() {
        return this.getMappings();
    }
    constructor(fileName, languageId, initSnapshot, vueCompilerOptions, plugins, ts) {
        this.fileName = fileName;
        this.languageId = languageId;
        this.initSnapshot = initSnapshot;
        this.vueCompilerOptions = vueCompilerOptions;
        this.plugins = plugins;
        this.ts = ts;
        // sources
        this.id = 'main';
        // computeds
        this.getVueSfc = (0, computedVueSfc_1.computedVueSfc)(this.plugins, this.fileName, this.languageId, () => this._snapshot());
        this.sfc = (0, computedSfc_1.computedSfc)(this.ts, this.plugins, this.fileName, () => this._snapshot(), this.getVueSfc);
        this.getMappings = (0, computedMappings_1.computedMappings)(() => this._snapshot(), this.sfc);
        this.getEmbeddedCodes = (0, computedFiles_1.computedFiles)(this.plugins, this.fileName, this.sfc);
        this._snapshot = (0, computeds_1.signal)(initSnapshot);
    }
    update(newSnapshot) {
        this._snapshot.set(newSnapshot);
    }
}
exports.VueVirtualCode = VueVirtualCode;
//# sourceMappingURL=vueFile.js.map