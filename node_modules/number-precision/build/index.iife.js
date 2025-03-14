var NP = (function (exports) {
'use strict';

/**
 * @desc 解决浮动运算问题，避免小数点后产生多位数和计算精度损失。
 *
 * 问题示例：2.3 + 2.4 = 4.699999999999999，1.0 - 0.9 = 0.09999999999999998
 */
/**
 * Correct the given number to specifying significant digits.
 *
 * @param num The input number
 * @param precision An integer specifying the number of significant digits
 *
 * @example strip(0.09999999999999998) === 0.1 // true
 */
function strip(num, precision) {
    if (precision === void 0) { precision = 15; }
    return +parseFloat(Number(num).toPrecision(precision));
}
/**
 * Return digits length of a number.
 *
 * @param num The input number
 */
function digitLength(num) {
    // Get digit length of e
    var eSplit = num.toString().split(/[eE]/);
    var len = (eSplit[0].split('.')[1] || '').length - +(eSplit[1] || 0);
    return len > 0 ? len : 0;
}
/**
 * Convert the given number to integer, support scientific notation.
 * The number will be scale up if it is decimal.
 *
 * @param num The input number
 */
function float2Fixed(num) {
    if (num.toString().indexOf('e') === -1) {
        return Number(num.toString().replace('.', ''));
    }
    var dLen = digitLength(num);
    return dLen > 0 ? strip(Number(num) * Math.pow(10, dLen)) : Number(num);
}
/**
 * Log a warning if the given number is out of bounds.
 *
 * @param num The input number
 */
function checkBoundary(num) {
    if (_boundaryCheckingState) {
        if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
            console.warn(num + " is beyond boundary when transfer to integer, the results may not be accurate");
        }
    }
}
/**
 * Create an operation to support rest params.
 *
 * @param operation The original operation
 */
function createOperation(operation) {
    return function () {
        var nums = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nums[_i] = arguments[_i];
        }
        var first = nums[0], others = nums.slice(1);
        return others.reduce(function (prev, next) { return operation(prev, next); }, first);
    };
}
/**
 * Accurate multiplication.
 *
 * @param nums The numbers to multiply
 */
var times = createOperation(function (num1, num2) {
    var num1Changed = float2Fixed(num1);
    var num2Changed = float2Fixed(num2);
    var baseNum = digitLength(num1) + digitLength(num2);
    var leftValue = num1Changed * num2Changed;
    checkBoundary(leftValue);
    return leftValue / Math.pow(10, baseNum);
});
/**
 * Accurate addition.
 *
 * @param nums The numbers to add
 */
var plus = createOperation(function (num1, num2) {
    // 取最大的小数位
    var baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)));
    // 把小数都转为整数然后再计算
    return (times(num1, baseNum) + times(num2, baseNum)) / baseNum;
});
/**
 * Accurate subtraction.
 *
 * @param nums The numbers to subtract
 */
var minus = createOperation(function (num1, num2) {
    var baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)));
    return (times(num1, baseNum) - times(num2, baseNum)) / baseNum;
});
/**
 * Accurate division.
 *
 * @param nums The numbers to divide
 */
var divide = createOperation(function (num1, num2) {
    var num1Changed = float2Fixed(num1);
    var num2Changed = float2Fixed(num2);
    checkBoundary(num1Changed);
    checkBoundary(num2Changed);
    // fix: 类似 10 ** -4 为 0.00009999999999999999，strip 修正
    return times(num1Changed / num2Changed, strip(Math.pow(10, digitLength(num2) - digitLength(num1))));
});
/**
 * Accurate rounding method.
 *
 * @param num The number to round
 * @param decimal An integer specifying the decimal digits
 */
function round(num, decimal) {
    var base = Math.pow(10, decimal);
    var result = divide(Math.round(Math.abs(times(num, base))), base);
    if (num < 0 && result !== 0) {
        result = times(result, -1);
    }
    return result;
}
var _boundaryCheckingState = true;
/**
 * Whether to check the bounds of number, default is enabled.
 *
 * @param flag The value to indicate whether is enabled
 */
function enableBoundaryChecking(flag) {
    if (flag === void 0) { flag = true; }
    _boundaryCheckingState = flag;
}
var index = {
    strip: strip,
    plus: plus,
    minus: minus,
    times: times,
    divide: divide,
    round: round,
    digitLength: digitLength,
    float2Fixed: float2Fixed,
    enableBoundaryChecking: enableBoundaryChecking,
};

exports.strip = strip;
exports.plus = plus;
exports.minus = minus;
exports.times = times;
exports.divide = divide;
exports.round = round;
exports.digitLength = digitLength;
exports.float2Fixed = float2Fixed;
exports.enableBoundaryChecking = enableBoundaryChecking;
exports['default'] = index;

return exports;

}({}));
