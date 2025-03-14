"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('cosmetic-brush', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("g", {
    "clip-path": 'url(#' + props.id + '64299104' + ')'
  }, [(0, _vue.createVNode)("path", {
    "d": "M16.0991 25.8287L38.7265 6.02967C38.7265 6.02967 40.8478 3.90835 42.9691 6.02967C45.0904 8.15099 42.9691 10.2723 42.9691 10.2723L23.1701 32.8997L16.0991 25.8287Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M22.4639 20.8789L28.1207 26.5358",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M5.49331 30.7782L16.0999 25.8284L23.171 32.8995L18.2212 43.5061C18.2212 43.5061 13.2715 44.2132 9.02884 39.9706C4.7862 35.7279 5.49331 30.7782 5.49331 30.7782Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M6.90783 36.4349L11.8576 34.3136",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M12.5653 42.0921L13.9795 39.2637",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M18.9291 23.3536L21.7575 20.8787L24.586 18.4038",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M30.5957 24.4141L28.1208 27.2425L25.646 30.0709",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]), (0, _vue.createVNode)("defs", null, [(0, _vue.createVNode)("clipPath", {
    "id": props.id + '64299104'
  }, [(0, _vue.createVNode)("rect", {
    "width": "48",
    "height": "48",
    "fill": props.colors[2]
  }, null)])])]);
});

exports.default = _default;