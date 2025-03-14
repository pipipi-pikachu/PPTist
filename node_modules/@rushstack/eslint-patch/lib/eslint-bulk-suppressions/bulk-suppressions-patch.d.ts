import { TSESTree } from '@typescript-eslint/types';
/**
 * @throws Throws an error if the command to retrieve the root path fails.
 * @returns The root path of the monorepo.
 */
export declare function getGitRootPath(): string;
export declare const GitRootPath: string;
export declare function shouldBulkSuppress(params: {
    filename: string;
    currentNode: TSESTree.Node;
    ruleId: string;
}): boolean;
export declare function onFinish(params: {
    filename: string;
}): void;
export declare function BulkSuppressionsPrune(params: {
    filename: string;
}): void;
export declare function requireFromPathToLinterJS(importPath: string): any;
export declare function patchClass<T, U extends T>(originalClass: new () => T, patchedClass: new () => U): void;
//# sourceMappingURL=bulk-suppressions-patch.d.ts.map