"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ICO = void 0;
const utils_1 = require("./utils");
const TYPE_ICON = 1;
/**
 * ICON Header
 *
 * | Offset | Size | Purpose |
 * | 0	    | 2    | Reserved. Must always be 0.  |
 * | 2      | 2    | Image type: 1 for icon (.ICO) image, 2 for cursor (.CUR) image. Other values are invalid. |
 * | 4      | 2    | Number of images in the file. |
 *
 */
const SIZE_HEADER = 2 + 2 + 2; // 6
/**
 * Image Entry
 *
 * | Offset | Size | Purpose |
 * | 0	    | 1    | Image width in pixels. Can be any number between 0 and 255. Value 0 means width is 256 pixels. |
 * | 1      | 1    | Image height in pixels. Can be any number between 0 and 255. Value 0 means height is 256 pixels. |
 * | 2      | 1    | Number of colors in the color palette. Should be 0 if the image does not use a color palette. |
 * | 3      | 1    | Reserved. Should be 0. |
 * | 4      | 2    | ICO format: Color planes. Should be 0 or 1. |
 * |        |      | CUR format: The horizontal coordinates of the hotspot in number of pixels from the left. |
 * | 6      | 2    | ICO format: Bits per pixel. |
 * |        |      | CUR format: The vertical coordinates of the hotspot in number of pixels from the top. |
 * | 8      | 4    | The size of the image's data in bytes |
 * | 12     | 4    | The offset of BMP or PNG data from the beginning of the ICO/CUR file |
 *
 */
const SIZE_IMAGE_ENTRY = 1 + 1 + 1 + 1 + 2 + 2 + 4 + 4; // 16
function getSizeFromOffset(input, offset) {
    const value = input[offset];
    return value === 0 ? 256 : value;
}
function getImageSize(input, imageIndex) {
    const offset = SIZE_HEADER + imageIndex * SIZE_IMAGE_ENTRY;
    return {
        height: getSizeFromOffset(input, offset + 1),
        width: getSizeFromOffset(input, offset),
    };
}
exports.ICO = {
    validate(input) {
        const reserved = (0, utils_1.readUInt16LE)(input, 0);
        const imageCount = (0, utils_1.readUInt16LE)(input, 4);
        if (reserved !== 0 || imageCount === 0)
            return false;
        const imageType = (0, utils_1.readUInt16LE)(input, 2);
        return imageType === TYPE_ICON;
    },
    calculate(input) {
        const nbImages = (0, utils_1.readUInt16LE)(input, 4);
        const imageSize = getImageSize(input, 0);
        if (nbImages === 1)
            return imageSize;
        const imgs = [imageSize];
        for (let imageIndex = 1; imageIndex < nbImages; imageIndex += 1) {
            imgs.push(getImageSize(input, imageIndex));
        }
        return {
            height: imageSize.height,
            images: imgs,
            width: imageSize.width,
        };
    },
};
