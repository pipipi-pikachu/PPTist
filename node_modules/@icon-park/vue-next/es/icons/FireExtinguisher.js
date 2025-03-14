import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('fire-extinguisher', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M6 20C6 15.5817 9.58172 12 14 12C18.4183 12 22 15.5817 22 20V44H6V20Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M30 44H42L36 26L30 44Z",
    "fill": props.colors[1]
  }, null), _createVNode("path", {
    "d": "M36 26L30 44H42L36 26ZM36 26V24C36 16.4575 36 12.6863 33.6569 10.3431C31.3137 8 27.5425 8 20 8H18M10 8H6",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("circle", {
    "cx": "14",
    "cy": "8",
    "r": "4",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});