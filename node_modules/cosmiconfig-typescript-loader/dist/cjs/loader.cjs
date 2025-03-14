"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// lib/loader.ts
var loader_exports = {};
__export(loader_exports, {
  TypeScriptLoader: () => TypeScriptLoader
});
module.exports = __toCommonJS(loader_exports);
var import_jiti = __toESM(require("jiti"));
var import_typescript_compile_error = require("./typescript-compile-error.cjs");
function TypeScriptLoader(options) {
  const loader = (0, import_jiti.default)("", { interopDefault: true, ...options });
  return (path) => {
    try {
      const result = loader(path);
      return result.default || result;
    } catch (error) {
      if (error instanceof Error) {
        throw import_typescript_compile_error.TypeScriptCompileError.fromError(error);
      }
      throw error;
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TypeScriptLoader
});
