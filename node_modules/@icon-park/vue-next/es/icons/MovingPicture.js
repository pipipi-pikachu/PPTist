import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('moving-picture', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("rect", {
    "x": "6",
    "y": "22",
    "width": "20",
    "height": "20",
    "rx": "3",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M30 6L42 6L42 18",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("circle", {
    "cx": "34",
    "cy": "42",
    "r": "1.5",
    "fill": props.colors[0],
    "stroke": props.colors[0]
  }, null), _createVNode("circle", {
    "r": "1.5",
    "transform": "matrix(1 0 0 -1 6 14)",
    "fill": props.colors[0],
    "stroke": props.colors[0]
  }, null), _createVNode("circle", {
    "cx": "42",
    "cy": "42",
    "r": "1.5",
    "fill": props.colors[0],
    "stroke": props.colors[0]
  }, null), _createVNode("circle", {
    "r": "1.5",
    "transform": "matrix(1 0 0 -1 6 6)",
    "fill": props.colors[0],
    "stroke": props.colors[0]
  }, null), _createVNode("circle", {
    "cx": "42",
    "cy": "34",
    "r": "1.5",
    "fill": props.colors[0],
    "stroke": props.colors[0]
  }, null), _createVNode("circle", {
    "r": "1.5",
    "transform": "matrix(1 0 0 -1 14 6)",
    "fill": props.colors[0],
    "stroke": props.colors[0]
  }, null), _createVNode("circle", {
    "cx": "42",
    "cy": "26",
    "r": "1.5",
    "fill": props.colors[0],
    "stroke": props.colors[0]
  }, null), _createVNode("circle", {
    "r": "1.5",
    "transform": "matrix(1 0 0 -1 22 6)",
    "fill": props.colors[0],
    "stroke": props.colors[0]
  }, null), _createVNode("path", {
    "d": "M6 34L12.1195 29.4103C13.2239 28.5821 14.7509 28.6143 15.8192 29.4885L25 37",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M42 6L30 18",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});