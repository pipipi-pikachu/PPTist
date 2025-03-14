// lib/loader.ts
import jiti from "jiti";
import { TypeScriptCompileError } from "./typescript-compile-error.mjs";
function TypeScriptLoader(options) {
  const loader = jiti("", { interopDefault: true, ...options });
  return (path) => {
    try {
      const result = loader(path);
      return result.default || result;
    } catch (error) {
      if (error instanceof Error) {
        throw TypeScriptCompileError.fromError(error);
      }
      throw error;
    }
  };
}
export {
  TypeScriptLoader
};
