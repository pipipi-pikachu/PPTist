import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('city', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M4 42H44",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("rect", {
    "x": "8",
    "y": "26",
    "width": "8",
    "height": "16",
    "rx": "2",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M12 34H13",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("rect", {
    "x": "16",
    "y": "4",
    "width": "24",
    "height": "38",
    "rx": "2",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("rect", {
    "x": "22",
    "y": "10",
    "width": "4",
    "height": "4",
    "fill": props.colors[2]
  }, null), _createVNode("rect", {
    "x": "30",
    "y": "10",
    "width": "4",
    "height": "4",
    "fill": props.colors[2]
  }, null), _createVNode("rect", {
    "x": "22",
    "y": "17",
    "width": "4",
    "height": "4",
    "fill": props.colors[2]
  }, null), _createVNode("rect", {
    "x": "30",
    "y": "17",
    "width": "4",
    "height": "4",
    "fill": props.colors[2]
  }, null), _createVNode("rect", {
    "x": "30",
    "y": "24",
    "width": "4",
    "height": "4",
    "fill": props.colors[2]
  }, null), _createVNode("rect", {
    "x": "30",
    "y": "31",
    "width": "4",
    "height": "4",
    "fill": props.colors[2]
  }, null)]);
});