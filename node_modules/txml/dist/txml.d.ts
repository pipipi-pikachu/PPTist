export var __esModule: boolean;
export type tNode = {
    tagName: string;
    attributes: object;
    children: (tNode | string)[];
};
export type TParseOptions = {
    pos?: number;
    noChildNodes?: string[];
    setPos?: boolean;
    keepComments?: boolean;
    keepWhitespace?: boolean;
    simplify?: boolean;
    filter?: (a: tNode, b: tNode) => boolean;
};
/**
 * behaves the same way as Array.filter, if the filter method return true, the element is in the resultList
 * @params children{Array} the children of a node
 * @param f{function} the filter method
 */
export function filter(children: any, f: Function, dept?: number, path?: string): any[];
export function getElementById(S: any, id: any, simplified: any): any;
export function getElementsByClassName(S: any, classname: any, simplified: any): any;
/**
 * @author: Tobias Nickel
 * @created: 06.04.2015
 * I needed a small xmlparser chat can be used in a worker.
 */
/**
 * @typedef tNode
 * @property {string} tagName
 * @property {object} attributes
 * @property {(tNode|string)[]} children
 **/
/**
 * @typedef TParseOptions
 * @property {number} [pos]
 * @property {string[]} [noChildNodes]
 * @property {boolean} [setPos]
 * @property {boolean} [keepComments]
 * @property {boolean} [keepWhitespace]
 * @property {boolean} [simplify]
 * @property {(a: tNode, b: tNode) => boolean} [filter]
 */
/**
 * parseXML / html into a DOM Object. with no validation and some failur tolerance
 * @param {string} S your XML to parse
 * @param {TParseOptions} [options]  all other options:
 * @return {(tNode | string)[]}
 */
export function parse(S: string, options?: TParseOptions): (tNode | string)[];
/**
 * transform the DomObject to an object that is like the object of PHP`s simple_xmp_load_*() methods.
 * this format helps you to write that is more likely to keep your program working, even if there a small changes in the XML schema.
 * be aware, that it is not possible to reproduce the original xml from a simplified version, because the order of elements is not saved.
 * therefore your program will be more flexible and easier to read.
 *
 * @param {tNode[]} children the childrenList
 */
export function simplify(children: tNode[]): {};
/**
 * similar to simplify, but lost less
 *
 * @param {tNode[]} children the childrenList
 */
export function simplifyLostLess(children: tNode[], parentAttributes?: {}): {};
/**
 * stringify a previously parsed string object.
 * this is useful,
 *  1. to remove whitespace
 * 2. to recreate xml data, with some changed data.
 * @param {tNode} O the object to Stringify
 */
export function stringify(O: tNode): string;
/**
 * use this method to read the text content, of some node.
 * It is great if you have mixed content like:
 * this text has some <b>big</b> text and a <a href=''>link</a>
 * @return {string}
 */
export function toContentString(tDom: any): string;
