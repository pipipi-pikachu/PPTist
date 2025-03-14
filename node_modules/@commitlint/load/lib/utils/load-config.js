"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEsmModule = exports.isDynamicAwaitSupported = exports.loadConfig = void 0;
const cosmiconfig_1 = require("cosmiconfig");
const cosmiconfig_typescript_loader_1 = require("cosmiconfig-typescript-loader");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const moduleName = 'commitlint';
async function loadConfig(cwd, configPath) {
    let tsLoaderInstance;
    const tsLoader = (...args) => {
        if (!tsLoaderInstance) {
            tsLoaderInstance = (0, cosmiconfig_typescript_loader_1.TypeScriptLoader)();
        }
        return tsLoaderInstance(...args);
    };
    // If dynamic await is supported (Node >= v20.8.0) or directory uses ESM, support
    // async js/cjs loaders (dynamic import). Otherwise, use synchronous js/cjs loaders.
    const loaders = (0, exports.isDynamicAwaitSupported)() || (0, exports.isEsmModule)(cwd)
        ? cosmiconfig_1.defaultLoaders
        : cosmiconfig_1.defaultLoadersSync;
    const explorer = (0, cosmiconfig_1.cosmiconfig)(moduleName, {
        searchPlaces: [
            // cosmiconfig overrides default searchPlaces if any new search place is added (For e.g. `*.ts` files),
            // we need to manually merge default searchPlaces from https://github.com/davidtheclark/cosmiconfig#searchplaces
            'package.json',
            `.${moduleName}rc`,
            `.${moduleName}rc.json`,
            `.${moduleName}rc.yaml`,
            `.${moduleName}rc.yml`,
            `.${moduleName}rc.js`,
            `.${moduleName}rc.cjs`,
            `.${moduleName}rc.mjs`,
            `${moduleName}.config.js`,
            `${moduleName}.config.cjs`,
            `${moduleName}.config.mjs`,
            // files supported by TypescriptLoader
            `.${moduleName}rc.ts`,
            `.${moduleName}rc.cts`,
            `${moduleName}.config.ts`,
            `${moduleName}.config.cts`,
        ],
        loaders: {
            '.ts': tsLoader,
            '.cts': tsLoader,
            '.cjs': loaders['.cjs'],
            '.js': loaders['.js'],
        },
    });
    const explicitPath = configPath ? path_1.default.resolve(cwd, configPath) : undefined;
    const explore = explicitPath ? explorer.load : explorer.search;
    const searchPath = explicitPath ? explicitPath : cwd;
    const local = await explore(searchPath);
    if (local) {
        return local;
    }
    return null;
}
exports.loadConfig = loadConfig;
// See the following issues for more context, contributing to failing Jest tests:
//  - Issue: https://github.com/nodejs/node/issues/40058
//  - Resolution: https://github.com/nodejs/node/pull/48510 (Node v20.8.0)
const isDynamicAwaitSupported = () => {
    const [major, minor] = process.version
        .replace('v', '')
        .split('.')
        .map((val) => parseInt(val));
    return major >= 20 && minor >= 8;
};
exports.isDynamicAwaitSupported = isDynamicAwaitSupported;
// Is the given directory set up to use ESM (ECMAScript Modules)?
const isEsmModule = (cwd) => {
    var _a;
    const packagePath = path_1.default.join(cwd, 'package.json');
    if (!(0, fs_1.existsSync)(packagePath)) {
        return false;
    }
    const packageJSON = (0, fs_1.readFileSync)(packagePath, { encoding: 'utf-8' });
    return ((_a = JSON.parse(packageJSON)) === null || _a === void 0 ? void 0 : _a.type) === 'module';
};
exports.isEsmModule = isEsmModule;
//# sourceMappingURL=load-config.js.map