import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('check-in', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M15.9999 21.0001L22.1302 6.98819C22.5987 5.91738 23.8816 5.47476 24.9107 6.0289L35.9996 12",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M26 31L26 12L42 12L42 41L26 41L26 37",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M4 44C13 44 13.7691 38.6834 16.3302 38.3125C19.3527 37.8748 22.4317 37.6497 25.1033 37C28.497 36.1747 31.2335 35.1121 32.3623 34.6448C32.7291 34.4929 33.0343 34.2285 33.2178 33.8764C33.7811 32.795 34.7903 30.4101 32.9209 30.1094C30.493 29.7188 22.9806 32.5833 19.1276 32.0625C15.2746 31.5417 16.6293 28.9375 17.8433 28.1563C21.1401 26.0345 25 27 25 27V18C25 18 10.3335 21.75 5 28.1563",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M32 21L42 21",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});