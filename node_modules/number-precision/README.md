# number-precision [![npm version](https://badge.fury.io/js/number-precision.svg)](http://badge.fury.io/js/number-precision) [![Build Status](https://travis-ci.org/nefe/number-precision.svg)](https://travis-ci.org/nefe/number-precision) [![codecov](https://codecov.io/gh/nefe/number-precision/branch/master/graph/badge.svg)](https://codecov.io/gh/nefe/number-precision)

Perform addition, subtraction, multiplication and division operations precisely using javascript

### Why

```js
0.1 + 0.2 = 0.30000000000000004
1.0 - 0.9 = 0.09999999999999998
0.105.toFixed(2) = 0.1 // not 0.11
```

### Install

```
npm install number-precision --save
```

### Methods

```js
NP.strip(num)         // strip a number to nearest right number
NP.plus(num1, num2, num3, ...)   // addition, num + num2 + num3, two numbers is required at least.
NP.minus(num1, num2, num3, ...)  // subtraction, num1 - num2 - num3
NP.times(num1, num2, num3, ...)  // multiplication, num1 * num2 * num3
NP.divide(num1, num2, num3, ...) // division, num1 / num2 / num3
NP.round(num, ratio)  // round a number based on ratio
```

### Usage

```js
import NP from 'number-precision'
NP.strip(0.09999999999999998); // = 0.1
NP.plus(0.1, 0.2);             // = 0.3, not 0.30000000000000004
NP.plus(2.3, 2.4);             // = 4.7, not 4.699999999999999
NP.minus(1.0, 0.9);            // = 0.1, not 0.09999999999999998
NP.times(3, 0.3);              // = 0.9, not 0.8999999999999999
NP.times(0.362, 100);          // = 36.2, not 36.199999999999996
NP.divide(1.21, 1.1);          // = 1.1, not 1.0999999999999999
NP.round(0.105, 2);            // = 0.11, not 0.1
```

PS: If you want to get rid of `XXX is beyond boundary when transfer to integer, the results may not be accurate`, use this at the beginning of your app to turn off boundary checking.
```js
NP.enableBoundaryChecking(false); // default param is true
```

### License
MIT
