"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('neural', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    "d": "M20.5 33.0002C22.466 33.0002 23.2904 29.4622 25 28.7533C26.7723 28.0184 29.4174 30.0889 30.753 28.7533C32.0887 27.4177 30.4474 24.4514 31.1823 22.6791C31.8912 20.9695 35 20.4662 35 18.5002C35 16.5343 31.462 16.0593 30.753 14.3498C30.0181 12.5775 32.0887 9.58281 30.753 8.2472C29.4174 6.91158 26.2656 8.9821 24.4933 8.2472C22.7837 7.53829 22.466 4.00024 20.5 4.00024C18.534 4.00024 18.0041 7.96486 16.2945 8.67377C14.5222 9.40867 11.5826 6.91158 10.247 8.2472C8.91134 9.58281 10.9819 12.228 10.247 14.0002C9.53805 15.7098 6 16.5343 6 18.5002C6 20.4662 9.53805 20.9695 10.247 22.6791C10.9819 24.4514 8.91134 27.4177 10.247 28.7533C11.5826 30.0889 14.5222 28.0184 16.2945 28.7533C18.0041 29.4622 18.534 33.0002 20.5 33.0002Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M20 22.0002C22.2091 22.0002 24 20.2094 24 18.0002C24 15.7911 22.2091 14.0002 20 14.0002C17.7909 14.0002 16 15.7911 16 18.0002C16 20.2094 17.7909 22.0002 20 22.0002Z",
    "fill": props.colors[3],
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M16.5692 30.0002C15.3611 36.7992 16.0762 41.0545 18.7144 42.7663C22.6719 45.3339 25.4482 43.3271 26.8968 41.8554C28.3454 40.3838 33.0495 33.9441 37.0763 33.9441C41.1031 33.9441 42.315 37.8244 41.9334 39.9441C41.679 41.3572 41.022 42.4025 39.9624 43.0799",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null)]);
});

exports.default = _default;