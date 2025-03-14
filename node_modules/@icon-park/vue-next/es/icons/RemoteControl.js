import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('remote-control', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("rect", {
    "x": "11",
    "y": "4",
    "width": "26",
    "height": "40",
    "rx": "2",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("circle", {
    "cx": "24",
    "cy": "34",
    "r": "4",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("rect", {
    "x": "18",
    "y": "10",
    "width": "12",
    "height": "8",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M23 24H25",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});