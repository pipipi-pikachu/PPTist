import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('lamp', false, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M14 9.5C14 7.567 15.567 6 17.5 6C19.433 6 21 7.567 21 9.5V21H14V9.5Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("path", {
    "d": "M27 9.5C27 7.567 28.567 6 30.5 6C32.433 6 34 7.567 34 9.5V21H27V9.5Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("rect", {
    "x": "18",
    "y": "34",
    "width": "12",
    "height": "8",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M10 22C10 21.4477 10.4477 21 11 21H37C37.5523 21 38 21.4477 38 22V26C38 30.4183 34.4183 34 30 34H18C13.5817 34 10 30.4183 10 26V22Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null)]);
});