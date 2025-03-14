"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findBox = exports.readUInt = exports.readUInt32LE = exports.readUInt32BE = exports.readInt32LE = exports.readUInt24LE = exports.readUInt16LE = exports.readUInt16BE = exports.readInt16LE = exports.toHexString = exports.toUTF8String = void 0;
const decoder = new TextDecoder();
const toUTF8String = (input, start = 0, end = input.length) => decoder.decode(input.slice(start, end));
exports.toUTF8String = toUTF8String;
const toHexString = (input, start = 0, end = input.length) => input
    .slice(start, end)
    .reduce((memo, i) => memo + ('0' + i.toString(16)).slice(-2), '');
exports.toHexString = toHexString;
const readInt16LE = (input, offset = 0) => {
    const val = input[offset] + input[offset + 1] * 2 ** 8;
    return val | ((val & (2 ** 15)) * 0x1fffe);
};
exports.readInt16LE = readInt16LE;
const readUInt16BE = (input, offset = 0) => input[offset] * 2 ** 8 + input[offset + 1];
exports.readUInt16BE = readUInt16BE;
const readUInt16LE = (input, offset = 0) => input[offset] + input[offset + 1] * 2 ** 8;
exports.readUInt16LE = readUInt16LE;
const readUInt24LE = (input, offset = 0) => input[offset] + input[offset + 1] * 2 ** 8 + input[offset + 2] * 2 ** 16;
exports.readUInt24LE = readUInt24LE;
const readInt32LE = (input, offset = 0) => input[offset] +
    input[offset + 1] * 2 ** 8 +
    input[offset + 2] * 2 ** 16 +
    (input[offset + 3] << 24);
exports.readInt32LE = readInt32LE;
const readUInt32BE = (input, offset = 0) => input[offset] * 2 ** 24 +
    input[offset + 1] * 2 ** 16 +
    input[offset + 2] * 2 ** 8 +
    input[offset + 3];
exports.readUInt32BE = readUInt32BE;
const readUInt32LE = (input, offset = 0) => input[offset] +
    input[offset + 1] * 2 ** 8 +
    input[offset + 2] * 2 ** 16 +
    input[offset + 3] * 2 ** 24;
exports.readUInt32LE = readUInt32LE;
// Abstract reading multi-byte unsigned integers
const methods = {
    readUInt16BE: exports.readUInt16BE,
    readUInt16LE: exports.readUInt16LE,
    readUInt32BE: exports.readUInt32BE,
    readUInt32LE: exports.readUInt32LE,
};
function readUInt(input, bits, offset, isBigEndian) {
    offset = offset || 0;
    const endian = isBigEndian ? 'BE' : 'LE';
    const methodName = ('readUInt' + bits + endian);
    return methods[methodName](input, offset);
}
exports.readUInt = readUInt;
function readBox(buffer, offset) {
    if (buffer.length - offset < 4)
        return;
    const boxSize = (0, exports.readUInt32BE)(buffer, offset);
    if (buffer.length - offset < boxSize)
        return;
    return {
        name: (0, exports.toUTF8String)(buffer, 4 + offset, 8 + offset),
        offset,
        size: boxSize,
    };
}
function findBox(buffer, boxName, offset) {
    while (offset < buffer.length) {
        const box = readBox(buffer, offset);
        if (!box)
            break;
        if (box.name === boxName)
            return box;
        offset += box.size;
    }
}
exports.findBox = findBox;
