import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('sound', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("rect", {
    "x": "8",
    "y": "4",
    "width": "32",
    "height": "40",
    "rx": "2",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("circle", {
    "cx": "24",
    "cy": "15",
    "r": "5",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("circle", {
    "cx": "14",
    "cy": "10",
    "r": "2",
    "fill": props.colors[0]
  }, null), _createVNode("circle", {
    "cx": "14",
    "cy": "38",
    "r": "2",
    "fill": props.colors[0]
  }, null), _createVNode("circle", {
    "cx": "34",
    "cy": "10",
    "r": "2",
    "fill": props.colors[0]
  }, null), _createVNode("circle", {
    "cx": "34",
    "cy": "38",
    "r": "2",
    "fill": props.colors[0]
  }, null), _createVNode("circle", {
    "cx": "24",
    "cy": "32",
    "r": "6",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null)]);
});