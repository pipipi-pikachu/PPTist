import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('two-triangles', false, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M24.0002 4L41.3207 34H6.67969L24.0002 4Z",
    "fill": props.colors[1]
  }, null), _createVNode("path", {
    "d": "M24.0002 44L41.3207 14H6.67969L24.0002 44Z",
    "fill": props.colors[1]
  }, null), _createVNode("path", {
    "d": "M24.0002 4L41.3207 34H6.67969L24.0002 4Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M24.0002 44L41.3207 14H6.67969L24.0002 44Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});