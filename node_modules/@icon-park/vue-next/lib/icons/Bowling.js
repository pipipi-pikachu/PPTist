"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('bowling', false, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 49 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M24.7773 44C35.8273 44 44.7773 35.05 44.7773 24C44.7773 12.95 35.8273 4 24.7773 4C13.7273 4 4.77734 12.95 4.77734 24C4.77734 35.05 13.7273 44 24.7773 44Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-miterlimit": "2",
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M24.7773 26C26.4373 26 27.7773 24.66 27.7773 23C27.7773 21.34 26.4373 20 24.7773 20C23.1173 20 21.7773 21.34 21.7773 23C21.7773 24.66 23.1173 26 24.7773 26Z",
    "fill": props.colors[0]
  }, null), (0, _vue.createVNode)("path", {
    "d": "M31.7773 18C33.4373 18 34.7773 16.66 34.7773 15C34.7773 13.34 33.4373 12 31.7773 12C30.1173 12 28.7773 13.34 28.7773 15C28.7773 16.66 30.1173 18 31.7773 18Z",
    "fill": props.colors[0]
  }, null), (0, _vue.createVNode)("path", {
    "d": "M17.7773 18C19.4373 18 20.7773 16.66 20.7773 15C20.7773 13.34 19.4373 12 17.7773 12C16.1173 12 14.7773 13.34 14.7773 15C14.7773 16.66 16.1173 18 17.7773 18Z",
    "fill": props.colors[0]
  }, null)]);
});

exports.default = _default;