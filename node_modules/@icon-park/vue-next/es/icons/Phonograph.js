import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('phonograph', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("rect", {
    "x": "6",
    "y": "6",
    "width": "36",
    "height": "36",
    "rx": "3",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("circle", {
    "cx": "24",
    "cy": "25",
    "r": "11",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("rect", {
    "x": "22",
    "y": "23",
    "width": "4",
    "height": "4",
    "rx": "2",
    "fill": props.colors[2]
  }, null), _createVNode("rect", {
    "x": "34",
    "y": "34",
    "width": "4",
    "height": "4",
    "rx": "2",
    "fill": props.colors[0]
  }, null), _createVNode("path", {
    "d": "M28 20L36 12",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});