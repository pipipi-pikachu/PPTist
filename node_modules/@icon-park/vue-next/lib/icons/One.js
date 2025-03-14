"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('one', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M11 40L6.9395 31.2023C5.84497 28.8308 6.76016 26.0164 9.04019 24.7422L20.2971 18.4516C21.3325 17.873 22.6117 17.9588 23.5606 18.6704L24.587 19.4403C25.2089 19.9067 26.1018 19.5164 26.1817 18.7432L27.3708 7.24931C27.4534 6.45005 27.8533 5.71736 28.4808 5.2154L28.6963 5.04293C29.4385 4.44919 30.5084 4.50844 31.1805 5.18051C31.7052 5.70522 32 6.41688 32 7.15893V29.4194C32 30.2579 32.9695 30.7244 33.6243 30.2006L37 27.5C38.6529 26.1777 40.8749 27.041 42.255 27.945C42.6936 28.2323 42.7587 28.8265 42.447 29.2482L34.5 40C34.5 40 31 44 23 44C15 44 11.6667 41.3333 11 40Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null)]);
});

exports.default = _default;