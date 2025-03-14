"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// lib/typescript-compile-error.ts
var typescript_compile_error_exports = {};
__export(typescript_compile_error_exports, {
  TypeScriptCompileError: () => TypeScriptCompileError
});
module.exports = __toCommonJS(typescript_compile_error_exports);
var TypeScriptCompileError = class _TypeScriptCompileError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
  static fromError(error) {
    const message = `TypeScriptLoader failed to compile TypeScript:
${error.message}`;
    const newError = new _TypeScriptCompileError(message);
    newError.stack = error.stack;
    return newError;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TypeScriptCompileError
});
