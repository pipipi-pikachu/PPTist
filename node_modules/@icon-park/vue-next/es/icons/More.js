import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('more', false, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("circle", {
    "cx": "12",
    "cy": "24",
    "r": "3",
    "fill": props.colors[0]
  }, null), _createVNode("circle", {
    "cx": "24",
    "cy": "24",
    "r": "3",
    "fill": props.colors[0]
  }, null), _createVNode("circle", {
    "cx": "36",
    "cy": "24",
    "r": "3",
    "fill": props.colors[0]
  }, null)]);
});