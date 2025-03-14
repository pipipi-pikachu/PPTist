import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('link-four', false, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M18 24H31",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M4 17C4 15.8954 4.89543 15 6 15H42C43.1046 15 44 15.8954 44 17V31C44 32.1046 43.1046 33 42 33H6C4.89543 33 4 32.1046 4 31V17Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null)]);
});