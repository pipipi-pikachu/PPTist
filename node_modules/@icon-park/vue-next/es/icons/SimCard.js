import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('sim-card', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M10 44H38C39.1046 44 40 43.1046 40 42V14.8847C40 14.3212 39.7623 13.7839 39.3453 13.4049L29.5721 4.52012C29.204 4.18544 28.7243 4 28.2268 4H10C8.89543 4 8 4.89543 8 6V42C8 43.1046 8.89543 44 10 44Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("circle", {
    "cx": "17",
    "cy": "14",
    "r": "3",
    "fill": props.colors[0]
  }, null), _createVNode("rect", {
    "x": "16",
    "y": "23",
    "width": "16",
    "height": "14",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});