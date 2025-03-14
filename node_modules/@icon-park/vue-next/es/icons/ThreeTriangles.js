import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('three-triangles', false, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M17.0001 7L24.0001 19.1244L29.9905 29.5H4.00977L17.0001 7Z",
    "fill": props.colors[1]
  }, null), _createVNode("path", {
    "d": "M31.0001 7L43.9905 29.5H18.0098L24.0001 19.1244L31.0001 7Z",
    "fill": props.colors[1]
  }, null), _createVNode("path", {
    "d": "M11.0098 41.5H36.9905L29.9905 29.5H18.0098L11.0098 41.5Z",
    "fill": props.colors[1]
  }, null), _createVNode("path", {
    "d": "M29.9905 29.5L24.0001 19.1244M18.0098 29.5L11.0098 41.5H36.9905L29.9905 29.5H18.0098ZM18.0098 29.5H43.9905L31.0001 7L24.0001 19.1244L18.0098 29.5ZM18.0098 29.5L24.0001 19.1244L18.0098 29.5ZM18.0098 29.5H29.9905H18.0098ZM29.9905 29.5H4.00977L17.0001 7L24.0001 19.1244L29.9905 29.5Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});