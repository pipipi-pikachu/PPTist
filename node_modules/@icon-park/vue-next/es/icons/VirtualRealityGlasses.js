import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('virtual-reality-glasses', false, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M5 16H43C43.5523 16 44 16.4477 44 17V39C44 39.5523 43.5523 40 43 40H30L24.0083 34.0013L18 40H5C4.44772 40 4 39.5523 4 39V17C4 16.4477 4.44772 16 5 16Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M14 32C16.2091 32 18 30.2091 18 28C18 25.7909 16.2091 24 14 24C11.7909 24 10 25.7909 10 28C10 30.2091 11.7909 32 14 32Z",
    "fill": props.colors[3],
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M34 32C36.2091 32 38 30.2091 38 28C38 25.7909 36.2091 24 34 24C31.7909 24 30 25.7909 30 28C30 30.2091 31.7909 32 34 32Z",
    "fill": props.colors[3],
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    "d": "M6 10H42H6Z",
    "fill": props.colors[1]
  }, null), _createVNode("path", {
    "d": "M6 10H42",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});