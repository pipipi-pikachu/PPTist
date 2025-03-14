// lib/typescript-compile-error.ts
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
export {
  TypeScriptCompileError
};
