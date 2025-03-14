import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('chart-proportion', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M16.3446 5.51758C13.9 6.53124 11.7001 8.01574 9.85786 9.85797C6.23858 13.4773 4 18.4773 4 24.0001C4 35.0458 12.9543 44.0001 24 44.0001V44.0001C29.5228 44.0001 34.5228 41.7615 38.1421 38.1422C39.9844 36.3 41.4689 34.1001 42.4825 31.6555",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M24 24H44C44 12.9543 35.0457 4 24 4L24 24Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});