import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('split-branch', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M44 44V4H24V17L33 26V44H44Z",
    "fill": props.colors[1]
  }, null), _createVNode("path", {
    "d": "M4 4V44H25V30L16 21V4H4Z",
    "fill": props.colors[1]
  }, null), _createVNode("path", {
    "d": "M44 44V4H24V17L33 26V44H44Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M4 4V44H25V30L16 21V4H4Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});