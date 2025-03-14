"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('radiation', false, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M24.0039 27C25.6608 27 27.0039 25.6569 27.0039 24C27.0039 22.3431 25.6608 21 24.0039 21C22.3471 21 21.0039 22.3431 21.0039 24C21.0039 25.6569 22.3471 27 24.0039 27Z",
    "fill": props.colors[0]
  }, null), (0, _vue.createVNode)("path", {
    "d": "M19.0405 31.476C20.4626 32.4194 22.1673 32.9688 24 32.9688C25.8327 32.9688 27.5374 32.4194 28.9595 31.476L35.021 40.6827C31.861 42.7792 28.0727 44 24 44C19.9273 44 16.139 42.7792 12.979 40.6827L19.0405 31.476ZM15.0159 24.484L4.03531 25.145C4.01188 24.7474 4 24.3467 4 23.9432C4 16.0911 8.49944 9.29287 15.0538 6L19.9742 15.8688C17.0247 17.3506 15 20.4098 15 23.9432C15 24.1248 15.0053 24.3051 15.0159 24.484ZM28.0258 15.8688L32.9462 6C39.5006 9.29287 44 16.0911 44 23.9432C44 24.3467 43.9881 24.7474 43.9647 25.145L32.9841 24.484C32.9947 24.3051 33 24.1248 33 23.9432C33 20.4098 30.9753 17.3506 28.0258 15.8688Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;