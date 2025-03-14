import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('multi-function-knife', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M30 10C30 6.68629 27.3137 4 24 4C20.6863 4 18 6.68629 18 10V38C18 41.3137 20.6863 44 24 44C27.3137 44 30 41.3137 30 38V10Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M30 20.3137L37.2426 27.5563C38.8047 29.1184 41.3374 29.1184 42.8995 27.5563C44.4616 25.9943 44.4616 23.4616 42.8995 21.8995L30 9V20.3137Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M18.0711 27.4142L10.8284 20.1716C9.26633 18.6095 6.73367 18.6095 5.17157 20.1716C3.60948 21.7337 3.60948 24.2663 5.17157 25.8284L18.0711 38.7279V27.4142Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M24 10V11",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M24 37V38",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});