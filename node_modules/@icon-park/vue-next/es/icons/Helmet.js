import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('helmet', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M42.34 32C43.41 29.55 44 26.84 44 24C44 12.95 35.05 4 24 4C12.95 4 4 12.95 4 24H24L24.01 32C24.01 35.87 27.14 39 31.01 39C34.88 39 38.01 35.87 38.01 32H42.34Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-miterlimit": "2",
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M31 34C32.1 34 33 33.1 33 32C33 30.9 32.1 30 31 30C29.9 30 29 30.9 29 32C29 33.1 29.9 34 31 34Z",
    "fill": props.colors[0]
  }, null), _createVNode("path", {
    "d": "M24 32L6 36C8.23 39.17 10.45 42.37 14 44L26 37",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-miterlimit": "2",
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});