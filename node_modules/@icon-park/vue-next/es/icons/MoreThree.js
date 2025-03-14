import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('more-three', false, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    "d": "M21.5 14C21.5 15.3807 22.6193 16.5 24 16.5C25.3807 16.5 26.5 15.3807 26.5 14C26.5 12.6193 25.3807 11.5 24 11.5C22.6193 11.5 21.5 12.6193 21.5 14ZM21.5 24C21.5 25.3807 22.6193 26.5 24 26.5C25.3807 26.5 26.5 25.3807 26.5 24C26.5 22.6193 25.3807 21.5 24 21.5C22.6193 21.5 21.5 22.6193 21.5 24ZM24 36.5C22.6193 36.5 21.5 35.3807 21.5 34C21.5 32.6193 22.6193 31.5 24 31.5C25.3807 31.5 26.5 32.6193 26.5 34C26.5 35.3807 25.3807 36.5 24 36.5Z",
    "fill": props.colors[2]
  }, null)]);
});