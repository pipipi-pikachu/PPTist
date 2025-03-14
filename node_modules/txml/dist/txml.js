'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// ==ClosureCompiler==
// @output_file_name default.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// ==/ClosureCompiler==
// module.exports = {
//     parse: parse,
//     simplify: simplify,
//     simplifyLostLess: simplifyLostLess,
//     filter: filter,
//     stringify: stringify,
//     toContentString: toContentString,
//     getElementById: getElementById,
//     getElementsByClassName: getElementsByClassName,
//     transformStream: transformStream,
// };

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
function parse(S, options) {
    "txml";
    options = options || {};

    var pos = options.pos || 0;
    var keepComments = !!options.keepComments;
    var keepWhitespace = !!options.keepWhitespace;

    var openBracket = "<";
    var openBracketCC = "<".charCodeAt(0);
    var closeBracket = ">";
    var closeBracketCC = ">".charCodeAt(0);
    var minusCC = "-".charCodeAt(0);
    var slashCC = "/".charCodeAt(0);
    var exclamationCC = '!'.charCodeAt(0);
    var singleQuoteCC = "'".charCodeAt(0);
    var doubleQuoteCC = '"'.charCodeAt(0);
    var openCornerBracketCC = '['.charCodeAt(0);
    var closeCornerBracketCC = ']'.charCodeAt(0);


    /**
     * parsing a list of entries
     */
    function parseChildren(tagName) {
        var children = [];
        while (S[pos]) {
            if (S.charCodeAt(pos) == openBracketCC) {
                if (S.charCodeAt(pos + 1) === slashCC) {
                    var closeStart = pos + 2;
                    pos = S.indexOf(closeBracket, pos);

                    var closeTag = S.substring(closeStart, pos);
                    if (closeTag.indexOf(tagName) == -1) {
                        var parsedText = S.substring(0, pos).split('\n');
                        throw new Error(
                            'Unexpected close tag\nLine: ' + (parsedText.length - 1) +
                            '\nColumn: ' + (parsedText[parsedText.length - 1].length + 1) +
                            '\nChar: ' + S[pos]
                        );
                    }

                    if (pos + 1) pos += 1;

                    return children;
                } else if (S.charCodeAt(pos + 1) === exclamationCC) {
                    if (S.charCodeAt(pos + 2) == minusCC) {
                        //comment support
                        const startCommentPos = pos;
                        while (pos !== -1 && !(S.charCodeAt(pos) === closeBracketCC && S.charCodeAt(pos - 1) == minusCC && S.charCodeAt(pos - 2) == minusCC && pos != -1)) {
                            pos = S.indexOf(closeBracket, pos + 1);
                        }
                        if (pos === -1) {
                            pos = S.length;
                        }
                        if (keepComments) {
                            children.push(S.substring(startCommentPos, pos + 1));
                        }
                    } else if (
                        S.charCodeAt(pos + 2) === openCornerBracketCC &&
                        S.charCodeAt(pos + 8) === openCornerBracketCC &&
                        S.substr(pos + 3, 5).toLowerCase() === 'cdata'
                    ) {
                        // cdata
                        var cdataEndIndex = S.indexOf(']]>', pos);
                        if (cdataEndIndex == -1) {
                            children.push(S.substr(pos + 9));
                            pos = S.length;
                        } else {
                            children.push(S.substring(pos + 9, cdataEndIndex));
                            pos = cdataEndIndex + 3;
                        }
                        continue;
                    } else {
                        // doctypesupport
                        const startDoctype = pos + 1;
                        pos += 2;
                        var encapsuled = false;
                        while ((S.charCodeAt(pos) !== closeBracketCC || encapsuled === true) && S[pos]) {
                            if (S.charCodeAt(pos) === openCornerBracketCC) {
                                encapsuled = true;
                            } else if (encapsuled === true && S.charCodeAt(pos) === closeCornerBracketCC) {
                                encapsuled = false;
                            }
                            pos++;
                        }
                        children.push(S.substring(startDoctype, pos));
                    }
                    pos++;
                    continue;
                }
                var node = parseNode();
                children.push(node);
                if (node.tagName[0] === '?') {
                    children.push(...node.children);
                    node.children = [];
                }
            } else {
                var text = parseText();
                if (keepWhitespace) {
                    if (text.length > 0) {
                        children.push(text);
                    }
                } else {
                    var trimmed = text.trim();
                    if (trimmed.length > 0) {
                        children.push(trimmed);
                    }
                }
                pos++;
            }
        }
        return children;
    }

    /**
     *    returns the text outside of texts until the first '<'
     */
    function parseText() {
        var start = pos;
        pos = S.indexOf(openBracket, pos) - 1;
        if (pos === -2)
            pos = S.length;
        return S.slice(start, pos + 1);
    }
    /**
     *    returns text until the first nonAlphabetic letter
     */
    var nameSpacer = '\r\n\t>/= ';

    function parseName() {
        var start = pos;
        while (nameSpacer.indexOf(S[pos]) === -1 && S[pos]) {
            pos++;
        }
        return S.slice(start, pos);
    }
    /**
     *    is parsing a node, including tagName, Attributes and its children,
     * to parse children it uses the parseChildren again, that makes the parsing recursive
     */
    var NoChildNodes = options.noChildNodes || ['img', 'br', 'input', 'meta', 'link', 'hr'];

    function parseNode() {
        pos++;
        const tagName = parseName();
        const attributes = {};
        let children = [];

        // parsing attributes
        while (S.charCodeAt(pos) !== closeBracketCC && S[pos]) {
            var c = S.charCodeAt(pos);
            if ((c > 64 && c < 91) || (c > 96 && c < 123)) {
                //if('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(S[pos])!==-1 ){
                var name = parseName();
                // search beginning of the string
                var code = S.charCodeAt(pos);
                while (code && code !== singleQuoteCC && code !== doubleQuoteCC && !((code > 64 && code < 91) || (code > 96 && code < 123)) && code !== closeBracketCC) {
                    pos++;
                    code = S.charCodeAt(pos);
                }
                if (code === singleQuoteCC || code === doubleQuoteCC) {
                    var value = parseString();
                    if (pos === -1) {
                        return {
                            tagName,
                            attributes,
                            children,
                        };
                    }
                } else {
                    value = null;
                    pos--;
                }
                attributes[name] = value;
            }
            pos++;
        }
        // optional parsing of children
        if (S.charCodeAt(pos - 1) !== slashCC) {
            if (tagName == "script") {
                var start = pos + 1;
                pos = S.indexOf('</script>', pos);
                children = [S.slice(start, pos)];
                pos += 9;
            } else if (tagName == "style") {
                var start = pos + 1;
                pos = S.indexOf('</style>', pos);
                children = [S.slice(start, pos)];
                pos += 8;
            } else if (NoChildNodes.indexOf(tagName) === -1) {
                pos++;
                children = parseChildren(tagName);
            } else {
                pos++;
            }
        } else {
            pos++;
        }
        return {
            tagName,
            attributes,
            children,
        };
    }

    /**
     *    is parsing a string, that starts with a char and with the same usually  ' or "
     */

    function parseString() {
        var startChar = S[pos];
        var startpos = pos + 1;
        pos = S.indexOf(startChar, startpos);
        return S.slice(startpos, pos);
    }

    /**
     *
     */
    function findElements() {
        var r = new RegExp('\\s' + options.attrName + '\\s*=[\'"]' + options.attrValue + '[\'"]').exec(S);
        if (r) {
            return r.index;
        } else {
            return -1;
        }
    }

    var out = null;
    if (options.attrValue !== undefined) {
        options.attrName = options.attrName || 'id';
        var out = [];

        while ((pos = findElements()) !== -1) {
            pos = S.lastIndexOf('<', pos);
            if (pos !== -1) {
                out.push(parseNode());
            }
            S = S.substr(pos);
            pos = 0;
        }
    } else if (options.parseNode) {
        out = parseNode();
    } else {
        out = parseChildren('');
    }

    if (options.filter) {
        out = filter(out, options.filter);
    }

    if (options.simplify) {
        return simplify(Array.isArray(out) ? out : [out]);
    }

    if (options.setPos) {
        out.pos = pos;
    }

    return out;
}

/**
 * transform the DomObject to an object that is like the object of PHP`s simple_xmp_load_*() methods.
 * this format helps you to write that is more likely to keep your program working, even if there a small changes in the XML schema.
 * be aware, that it is not possible to reproduce the original xml from a simplified version, because the order of elements is not saved.
 * therefore your program will be more flexible and easier to read.
 *
 * @param {tNode[]} children the childrenList
 */
function simplify(children) {
    var out = {};
    if (!children.length) {
        return '';
    }

    if (children.length === 1 && typeof children[0] == 'string') {
        return children[0];
    }
    // map each object
    children.forEach(function(child) {
        if (typeof child !== 'object') {
            return;
        }
        if (!out[child.tagName])
            out[child.tagName] = [];
        var kids = simplify(child.children);
        out[child.tagName].push(kids);
        if (Object.keys(child.attributes).length && typeof kids !== 'string') {
            kids._attributes = child.attributes;
        }
    });

    for (var i in out) {
        if (out[i].length == 1) {
            out[i] = out[i][0];
        }
    }

    return out;
}

/**
 * similar to simplify, but lost less
 *
 * @param {tNode[]} children the childrenList
 */
function simplifyLostLess(children, parentAttributes = {}) {
    var out = {};
    if (!children.length) {
        return out;
    }

    if (children.length === 1 && typeof children[0] == 'string') {
        return Object.keys(parentAttributes).length ? {
            _attributes: parentAttributes,
            value: children[0]
        } : children[0];
    }
    // map each object
    children.forEach(function(child) {
        if (typeof child !== 'object') {
            return;
        }
        if (!out[child.tagName])
            out[child.tagName] = [];
        var kids = simplifyLostLess(child.children || [], child.attributes);
        out[child.tagName].push(kids);
        if (Object.keys(child.attributes).length) {
            kids._attributes = child.attributes;
        }
    });

    return out;
}
/**
 * behaves the same way as Array.filter, if the filter method return true, the element is in the resultList
 * @params children{Array} the children of a node
 * @param f{function} the filter method
 */
function filter(children, f, dept = 0, path = '') {
    var out = [];
    children.forEach(function(child, i) {
        if (typeof(child) === 'object' && f(child, i, dept, path)) out.push(child);
        if (child.children) {
            var kids = filter(child.children, f, dept + 1, (path ? path + '.' : '') + i + '.' + child.tagName);
            out = out.concat(kids);
        }
    });
    return out;
}
/**
 * stringify a previously parsed string object.
 * this is useful,
 *  1. to remove whitespace
 * 2. to recreate xml data, with some changed data.
 * @param {tNode} O the object to Stringify
 */
function stringify(O) {
    var out = '';

    function writeChildren(O) {
        if (O) {
            for (var i = 0; i < O.length; i++) {
                if (typeof O[i] == 'string') {
                    out += O[i].trim();
                } else {
                    writeNode(O[i]);
                }
            }
        }
    }

    function writeNode(N) {
        out += "<" + N.tagName;
        for (var i in N.attributes) {
            if (N.attributes[i] === null) {
                out += ' ' + i;
            } else if (N.attributes[i].indexOf('"') === -1) {
                out += ' ' + i + '="' + N.attributes[i].trim() + '"';
            } else {
                out += ' ' + i + "='" + N.attributes[i].trim() + "'";
            }
        }
        if (N.tagName[0] === '?') {
            out += '?>';
            return;
        }
        out += '>';
        writeChildren(N.children);
        out += '</' + N.tagName + '>';
    }
    writeChildren(O);

    return out;
}

/**
 * use this method to read the text content, of some node.
 * It is great if you have mixed content like:
 * this text has some <b>big</b> text and a <a href=''>link</a>
 * @return {string}
 */
function toContentString(tDom) {
    if (Array.isArray(tDom)) {
        var out = '';
        tDom.forEach(function(e) {
            out += ' ' + toContentString(e);
            out = out.trim();
        });
        return out;
    } else if (typeof tDom === 'object') {
        return toContentString(tDom.children)
    } else {
        return ' ' + tDom;
    }
}
function getElementById(S, id, simplified) {
    var out = parse(S, {
        attrValue: id
    });
    return simplified ? tXml.simplify(out) : out[0];
}
function getElementsByClassName(S, classname, simplified) {
    const out = parse(S, {
        attrName: 'class',
        attrValue: '[a-zA-Z0-9- ]*' + classname + '[a-zA-Z0-9- ]*'
    });
    return simplified ? tXml.simplify(out) : out;
}

exports.filter = filter;
exports.getElementById = getElementById;
exports.getElementsByClassName = getElementsByClassName;
exports.parse = parse;
exports.simplify = simplify;
exports.simplifyLostLess = simplifyLostLess;
exports.stringify = stringify;
exports.toContentString = toContentString;
