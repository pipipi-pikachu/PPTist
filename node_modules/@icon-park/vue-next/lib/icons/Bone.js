"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('bone', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M43.5229 17.3147C43.5228 13.072 39.9873 13.072 37.5125 10.5972C35.0376 8.1223 35.0375 4.58669 30.795 4.58674C27.9665 4.58672 25.4916 7.7687 25.4917 9.89005C25.4917 12.0114 26.1988 13.4256 27.613 14.8398L14.8851 27.5677C13.4709 26.1536 12.0566 25.4464 9.93531 25.4464C7.81402 25.4464 4.63195 27.9212 4.632 30.7497C4.2784 35.3458 8.52116 35.3459 10.6424 37.4672C12.7637 39.5885 12.7637 43.8311 17.3599 43.4776C20.1883 43.4776 22.6633 40.2957 22.6632 38.1743C22.6632 36.0529 21.9562 34.6388 20.5419 33.2246L33.2698 20.4966C34.684 21.9109 36.0983 22.618 38.2196 22.618C40.3409 22.618 43.5229 20.143 43.5229 17.3147Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;