/**
 * @desc 解决浮动运算问题，避免小数点后产生多位数和计算精度损失。
 *
 * 问题示例：2.3 + 2.4 = 4.699999999999999，1.0 - 0.9 = 0.09999999999999998
 */
declare type NumberType = number | string;
/**
 * Correct the given number to specifying significant digits.
 *
 * @param num The input number
 * @param precision An integer specifying the number of significant digits
 *
 * @example strip(0.09999999999999998) === 0.1 // true
 */
declare function strip(num: NumberType, precision?: number): number;
/**
 * Return digits length of a number.
 *
 * @param num The input number
 */
declare function digitLength(num: NumberType): number;
/**
 * Convert the given number to integer, support scientific notation.
 * The number will be scale up if it is decimal.
 *
 * @param num The input number
 */
declare function float2Fixed(num: NumberType): number;
/**
 * Accurate multiplication.
 *
 * @param nums The numbers to multiply
 */
declare const times: (...nums: NumberType[]) => number;
/**
 * Accurate addition.
 *
 * @param nums The numbers to add
 */
declare const plus: (...nums: NumberType[]) => number;
/**
 * Accurate subtraction.
 *
 * @param nums The numbers to subtract
 */
declare const minus: (...nums: NumberType[]) => number;
/**
 * Accurate division.
 *
 * @param nums The numbers to divide
 */
declare const divide: (...nums: NumberType[]) => number;
/**
 * Accurate rounding method.
 *
 * @param num The number to round
 * @param decimal An integer specifying the decimal digits
 */
declare function round(num: NumberType, decimal: number): number;
/**
 * Whether to check the bounds of number, default is enabled.
 *
 * @param flag The value to indicate whether is enabled
 */
declare function enableBoundaryChecking(flag?: boolean): void;
export { strip, plus, minus, times, divide, round, digitLength, float2Fixed, enableBoundaryChecking };
declare const _default: {
    strip: typeof strip;
    plus: (...nums: NumberType[]) => number;
    minus: (...nums: NumberType[]) => number;
    times: (...nums: NumberType[]) => number;
    divide: (...nums: NumberType[]) => number;
    round: typeof round;
    digitLength: typeof digitLength;
    float2Fixed: typeof float2Fixed;
    enableBoundaryChecking: typeof enableBoundaryChecking;
};
export default _default;
