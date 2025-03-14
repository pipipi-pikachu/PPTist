"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('romper', false, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M6.57241 19.5747L4.40745 12.3582C4.16338 11.5446 4.4545 10.6619 5.17189 10.2071C8.05736 8.37793 14.6413 5 24 5C33.3427 5 39.7999 8.36639 42.7589 10.1977C43.5067 10.6605 43.8274 11.5754 43.5747 12.4177L41.4276 19.5747C41.1738 20.4207 40.3952 21 39.5119 21H36C34.8954 21 34 21.8911 34 22.9957V33.0019C34 34.1065 33.0949 35.0132 32.0273 35.2966C30.7283 35.6415 29.0752 36.3873 28 38C26 41 26 44 26 44H22C22 44 22 41 20 38C18.9248 36.3873 17.2717 35.6415 15.9727 35.2966C14.9051 35.0132 14 34.1065 14 33.0019V22.9957C14 21.8911 13.1046 21 12 21H8.48806C7.60484 21 6.8262 20.4207 6.57241 19.5747Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M29.811 5.5C29.9344 5.97943 30 6.48205 30 7C30 10.3137 27.3137 13 24 13C20.6863 13 18 10.3137 18 7C18 6.48205 18.0656 5.97943 18.189 5.5",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M13.5 6.49375C16.4326 5.63028 19.9575 5 24 5C28.0425 5 31.5449 5.63028 34.4573 6.49375",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;