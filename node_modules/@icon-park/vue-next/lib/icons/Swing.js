"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('swing', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("g", {
    "clip-path": 'url(#' + props.id + '25eac417' + ')'
  }, [(0, _vue.createVNode)("path", {
    "d": "M9.99985 35.9998C8.00079 32.4998 7.99899 25.9998 7.99975 16.9998C8.00001 13.9998 11.9995 12.9998 13.9993 15.9998C15.1072 17.6617 15.8159 22.264 15.8159 22.264L22.3109 11.0145C23.0068 9.80903 24.5483 9.396 25.7538 10.092C26.9593 10.788 27.3723 12.3294 26.6763 13.5349L27.0641 12.8633C27.7601 11.6578 29.3015 11.2448 30.507 11.9408C31.7125 12.6368 32.1256 14.1783 31.4296 15.3838L31.0418 16.0554C31.7378 14.8499 33.2793 14.4368 34.4848 15.1328C35.6903 15.8288 36.1033 17.3703 35.4073 18.5758L33.8549 21.2646C34.5517 20.0578 36.0948 19.6443 37.3016 20.3411C38.5066 21.0367 38.921 22.5765 38.2279 23.783L29.0588 39.745C28.9612 39.9148 28.8614 40.0815 28.7382 40.2337C28.1666 40.9395 26.1434 42.9998 21.9999 42.9998C17.3408 42.9998 12.4782 40.339 9.99985 35.9998Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M37 5C38.3788 5.73333 40.5055 6.75828 42 9C43 10.5 43.5 12.5 43.7908 15",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]), (0, _vue.createVNode)("defs", null, [(0, _vue.createVNode)("clipPath", {
    "id": props.id + '25eac417'
  }, [(0, _vue.createVNode)("rect", {
    "width": "48",
    "height": "48",
    "fill": props.colors[2]
  }, null)])])]);
});

exports.default = _default;