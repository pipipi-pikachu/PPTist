import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('subway', false, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("rect", {
    "x": "8",
    "y": "6",
    "width": "32",
    "height": "26",
    "rx": "2",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("circle", {
    "cx": "14",
    "cy": "27",
    "r": "2",
    "fill": props.colors[0]
  }, null), _createVNode("circle", {
    "cx": "34",
    "cy": "27",
    "r": "2",
    "fill": props.colors[0]
  }, null), _createVNode("rect", {
    "x": "14",
    "y": "12",
    "width": "20",
    "height": "10",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M32 32L40 41",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M17 32L8 41",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});