"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGlobalTypes = generateGlobalTypes;
const shared_1 = require("../../utils/shared");
function generateGlobalTypes(vueCompilerOptions) {
    const fnPropsType = `(K extends { $props: infer Props } ? Props : any)${vueCompilerOptions.strictTemplates ? '' : ' & Record<string, unknown>'}`;
    return `export const __VLS_globalTypesStart = {};
declare module '${vueCompilerOptions.lib}' {
	interface GlobalComponents {}
}
declare global {
	type __VLS_IntrinsicElements = ${vueCompilerOptions.target >= 3.3
        ? `import('${vueCompilerOptions.lib}/jsx-runtime').JSX.IntrinsicElements;`
        : `globalThis.JSX.IntrinsicElements;`}
	type __VLS_Element = ${vueCompilerOptions.target >= 3.3
        ? `import('${vueCompilerOptions.lib}/jsx-runtime').JSX.Element;`
        : `globalThis.JSX.Element;`}
	type __VLS_GlobalComponents = ${vueCompilerOptions.target >= 3.5
        ? `import('${vueCompilerOptions.lib}').GlobalComponents;`
        : `import('${vueCompilerOptions.lib}').GlobalComponents & Pick<typeof import('${vueCompilerOptions.lib}'), 'Transition' | 'TransitionGroup' | 'KeepAlive' | 'Suspense' | 'Teleport'>;`}
	type __VLS_IsAny<T> = 0 extends 1 & T ? true : false;
	type __VLS_PickNotAny<A, B> = __VLS_IsAny<A> extends true ? B : A;

	const __VLS_intrinsicElements: __VLS_IntrinsicElements;

	// v-for
	function __VLS_getVForSourceType(source: number): [number, number, number][];
	function __VLS_getVForSourceType(source: string): [string, number, number][];
	function __VLS_getVForSourceType<T extends any[]>(source: T): [
		item: T[number],
		key: number,
		index: number,
	][];
	function __VLS_getVForSourceType<T extends { [Symbol.iterator](): Iterator<any> }>(source: T): [
		item: T extends { [Symbol.iterator](): Iterator<infer T1> } ? T1 : never, 
		key: number,
		index: undefined,
	][];
	// #3845
	function __VLS_getVForSourceType<T extends number | { [Symbol.iterator](): Iterator<any> }>(source: T): [
		item: number | (Exclude<T, number> extends { [Symbol.iterator](): Iterator<infer T1> } ? T1 : never), 
		key: number,
		index: undefined,
	][];
	function __VLS_getVForSourceType<T>(source: T): [
		item: T[keyof T],
		key: keyof T,
		index: number,
	][];

	// @ts-ignore
	function __VLS_getSlotParams<T>(slot: T): Parameters<__VLS_PickNotAny<NonNullable<T>, (...args: any[]) => any>>;
	// @ts-ignore
	function __VLS_getSlotParam<T>(slot: T): Parameters<__VLS_PickNotAny<NonNullable<T>, (...args: any[]) => any>>[0];
	function __VLS_directiveFunction<T>(dir: T):
		T extends import('${vueCompilerOptions.lib}').ObjectDirective<infer E, infer V> | import('${vueCompilerOptions.lib}').FunctionDirective<infer E, infer V> ? (value: V) => void
		: T;
	function __VLS_withScope<T, K>(ctx: T, scope: K): ctx is T & K;
	function __VLS_makeOptional<T>(t: T): { [K in keyof T]?: T[K] };
	function __VLS_nonNullable<T>(t: T): T extends null | undefined ? never : T;

	type __VLS_SelfComponent<N, C> = string extends N ? {} : N extends string ? { [P in N]: C } : {};
	type __VLS_WithComponent<N0 extends string, LocalComponents, N1 extends string, N2 extends string, N3 extends string> =
		N1 extends keyof LocalComponents ? N1 extends N0 ? Pick<LocalComponents, N0 extends keyof LocalComponents ? N0 : never> : { [K in N0]: LocalComponents[N1] } :
		N2 extends keyof LocalComponents ? N2 extends N0 ? Pick<LocalComponents, N0 extends keyof LocalComponents ? N0 : never> : { [K in N0]: LocalComponents[N2] } :
		N3 extends keyof LocalComponents ? N3 extends N0 ? Pick<LocalComponents, N0 extends keyof LocalComponents ? N0 : never> : { [K in N0]: LocalComponents[N3] } :
		N1 extends keyof __VLS_GlobalComponents ? N1 extends N0 ? Pick<__VLS_GlobalComponents, N0 extends keyof __VLS_GlobalComponents ? N0 : never> : { [K in N0]: __VLS_GlobalComponents[N1] } :
		N2 extends keyof __VLS_GlobalComponents ? N2 extends N0 ? Pick<__VLS_GlobalComponents, N0 extends keyof __VLS_GlobalComponents ? N0 : never> : { [K in N0]: __VLS_GlobalComponents[N2] } :
		N3 extends keyof __VLS_GlobalComponents ? N3 extends N0 ? Pick<__VLS_GlobalComponents, N0 extends keyof __VLS_GlobalComponents ? N0 : never> : { [K in N0]: __VLS_GlobalComponents[N3] } :
		${vueCompilerOptions.strictTemplates ? '{}' : '{ [K in N0]: unknown }'}

	function __VLS_asFunctionalComponent<T, K = T extends new (...args: any) => any ? InstanceType<T> : unknown>(t: T, instance?: K):
		T extends new (...args: any) => any
		? (props: ${fnPropsType}, ctx?: any) => __VLS_Element & { __ctx?: {
			attrs?: any,
			slots?: K extends { ${(0, shared_1.getSlotsPropertyName)(vueCompilerOptions.target)}: infer Slots } ? Slots : any,
			emit?: K extends { $emit: infer Emit } ? Emit : any
		} & { props?: ${fnPropsType}; expose?(exposed: K): void; } }
		: T extends () => any ? (props: {}, ctx?: any) => ReturnType<T>
		: T extends (...args: any) => any ? T
		: (_: {}${vueCompilerOptions.strictTemplates ? '' : ' & Record<string, unknown>'}, ctx?: any) => { __ctx?: { attrs?: any, expose?: any, slots?: any, emit?: any, props?: {}${vueCompilerOptions.strictTemplates ? '' : ' & Record<string, unknown>'} } };
	function __VLS_elementAsFunction<T>(tag: T, endTag?: T): (_: T${vueCompilerOptions.strictTemplates ? '' : ' & Record<string, unknown>'}) => void;
	function __VLS_functionalComponentArgsRest<T extends (...args: any) => any>(t: T): Parameters<T>['length'] extends 2 ? [any] : [];
	function __VLS_pickFunctionalComponentCtx<T, K>(comp: T, compInstance: K): __VLS_PickNotAny<
		'__ctx' extends keyof __VLS_PickNotAny<K, {}> ? K extends { __ctx?: infer Ctx } ? Ctx : never : any
		, T extends (props: any, ctx: infer Ctx) => any ? Ctx : any
	>;
	type __VLS_FunctionalComponentProps<T, K> =
		'__ctx' extends keyof __VLS_PickNotAny<K, {}> ? K extends { __ctx?: { props?: infer P } } ? NonNullable<P> : never
		: T extends (props: infer P, ...args: any) => any ? P :
		{};
	type __VLS_IsFunction<T, K> = K extends keyof T
		? __VLS_IsAny<T[K]> extends false
		? unknown extends T[K]
		? false
		: true
		: false
		: false;

	function __VLS_normalizeSlot<S>(s: S): S extends () => infer R ? (props: {}) => R : S;

	/**
	 * emit
	 */
	// fix https://github.com/vuejs/language-tools/issues/926
	type __VLS_UnionToIntersection<U> = (U extends unknown ? (arg: U) => unknown : never) extends ((arg: infer P) => unknown) ? P : never;
	type __VLS_OverloadUnionInner<T, U = unknown> = U & T extends (...args: infer A) => infer R
		? U extends T
		? never
		: __VLS_OverloadUnionInner<T, Pick<T, keyof T> & U & ((...args: A) => R)> | ((...args: A) => R)
		: never;
	type __VLS_OverloadUnion<T> = Exclude<
		__VLS_OverloadUnionInner<(() => never) & T>,
		T extends () => never ? never : () => never
	>;
	type __VLS_ConstructorOverloads<T> = __VLS_OverloadUnion<T> extends infer F
		? F extends (event: infer E, ...args: infer A) => any
		? { [K in E & string]: (...args: A) => void; }
		: never
		: never;
	type __VLS_NormalizeEmits<T> = __VLS_PrettifyGlobal<
		__VLS_UnionToIntersection<
			__VLS_ConstructorOverloads<T> & {
				[K in keyof T]: T[K] extends any[] ? { (...args: T[K]): void } : never
			}
		>
	>;
	type __VLS_PrettifyGlobal<T> = { [K in keyof T]: T[K]; } & {};
}
export const __VLS_globalTypesEnd = {};
`;
}
;
//# sourceMappingURL=globalTypes.js.map