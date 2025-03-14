import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('bachelor-cap-one', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M5 16L24 6L43 16L24 26L5 16Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M11 20V34.464C11 35.9282 12.0551 37.1872 13.4711 37.5594C15.6758 38.139 19.0564 39.2194 22.3562 41.0292C23.3775 41.5893 24.6225 41.5893 25.6438 41.0292C28.9436 39.2194 32.3242 38.139 34.5289 37.5594C35.9449 37.1872 37 35.9282 37 34.464V20",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M43 16L43 32",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});