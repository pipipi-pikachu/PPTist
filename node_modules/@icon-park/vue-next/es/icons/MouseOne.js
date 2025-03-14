import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('mouse-one', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("rect", {
    "x": "12",
    "y": "12",
    "width": "24",
    "height": "32",
    "rx": "12",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("path", {
    "d": "M12 24C12 17.3726 17.3726 12 24 12C30.6274 12 36 17.3726 36 24V25H12V24Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("path", {
    "d": "M24 25C24 25 24 16 24 12C24 8 25.5 4 31 4C37 4 39 9 39 13",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});