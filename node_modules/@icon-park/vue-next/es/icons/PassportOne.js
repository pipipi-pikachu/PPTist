import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('passport-one', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M13 40L9 40C7.89543 40 7 39.1046 7 38L7 6C7 4.89543 7.89543 4 9 4L29 4C30.1046 4 31 4.89543 31 6L31 10",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null), _createVNode("rect", {
    "x": "13",
    "y": "44",
    "width": "34",
    "height": "28",
    "rx": "2",
    "transform": "rotate(-90 13 44)",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("circle", {
    "cx": "27",
    "cy": "27",
    "r": "8",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("path", {
    "d": "M34.9998 28C34.9998 28 32 27.5 29.9995 29C27.999 30.5 27.401 34.1025 27.9999 35",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null), _createVNode("path", {
    "d": "M24 27C24 29 22 31 20 31",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null), _createVNode("path", {
    "d": "M31 20C31 20 31 24 28 24",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null)]);
});