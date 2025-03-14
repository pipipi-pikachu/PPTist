import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('egg', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("circle", {
    "cx": "24",
    "cy": "24",
    "r": "10",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M44.0001 24C44.0001 26.6325 43.4915 29.1463 42.5672 31.4483C41.6312 33.7794 38.4382 31.5194 35.2215 34.9695C32.0049 38.4196 34.5105 41.2363 32.017 42.3284C29.5627 43.4035 26.8511 44 24.0001 44C12.9544 44 4.00012 35.0457 4.00012 24C4.00012 12.9543 12.9544 4 24.0001 4C35.0458 4 44.0001 12.9543 44.0001 24Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("path", {
    "d": "M20 25C20 25 20.2109 26.2109 21 27C21.7891 27.7891 23 28 23 28",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null)]);
});