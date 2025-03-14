import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('memory-one', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("rect", {
    "x": "5",
    "y": "28",
    "width": "38",
    "height": "14",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("rect", {
    "x": "5",
    "y": "6",
    "width": "38",
    "height": "14",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("rect", {
    "x": "11",
    "y": "11",
    "width": "4",
    "height": "4",
    "rx": "2",
    "fill": props.colors[2]
  }, null), _createVNode("rect", {
    "x": "11",
    "y": "33",
    "width": "4",
    "height": "4",
    "rx": "2",
    "fill": props.colors[2]
  }, null), _createVNode("rect", {
    "x": "19",
    "y": "11",
    "width": "4",
    "height": "4",
    "rx": "2",
    "fill": props.colors[2]
  }, null), _createVNode("rect", {
    "x": "19",
    "y": "33",
    "width": "4",
    "height": "4",
    "rx": "2",
    "fill": props.colors[2]
  }, null), _createVNode("path", {
    "d": "M31 13H35",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M31 35H35",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});