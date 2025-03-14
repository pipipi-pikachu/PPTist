"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('flirt', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M26 21.0001C23.9999 20.5001 21.2465 19.3622 17.1704 22.0924C14.1394 24.1226 12.8646 27.2399 12.4346 29.5301C12.2303 30.6188 13.1547 31.4968 14.2547 31.3664C15.0506 31.2721 15.9341 31.1251 16.6025 30.899C18.5728 30.2324 18.3142 28.9686 19.3194 27.4462C20.3245 25.9238 22.8521 25.4066 24.9318 26.561C27.0114 27.7155 27.678 29.6859 27.23 31.3576C26.7821 33.0293 25.7769 34.5518 23.2493 35.069C20.7218 35.5862 19.9059 34.1731 17.269 32.8693C15.8949 32.1899 14.1027 33.0709 13.0201 33.7678C12.4071 34.1624 12.1531 34.9076 12.4103 35.5897C12.585 36.0529 12.8254 36.5948 13.139 37.1379C13.9548 38.551 17.5169 43.089 22.1241 43.7262C26.7314 44.3635 31.5279 42.0652 34.2449 38.6125C36.9618 35.1597 37.0418 30.4032 35.1515 26.3131",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M35.046 26.4199L32.0005 14L22.7078 4.70721C22.3173 4.31665 21.6881 4.3232 21.3732 4.77699C20.6205 5.86185 19.6217 7.93093 21.0008 10C21.488 10.7311 25.0015 15 25.0015 15C25.0015 15 27.0977 27.5743 27.4734 29.5672",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;