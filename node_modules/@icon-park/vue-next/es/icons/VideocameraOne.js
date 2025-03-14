import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('videocamera-one', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("rect", {
    "x": "4",
    "y": "21",
    "width": "31",
    "height": "20",
    "rx": "2",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("rect", {
    "x": "20",
    "y": "27",
    "width": "9",
    "height": "8",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("circle", {
    "cx": "27",
    "cy": "13",
    "r": "5",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("circle", {
    "cx": "13",
    "cy": "13",
    "r": "5",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M35 35L44 39V23L35 27",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});