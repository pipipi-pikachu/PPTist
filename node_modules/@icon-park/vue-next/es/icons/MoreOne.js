import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('more-one', false, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("circle", {
    "cx": "24",
    "cy": "12",
    "r": "3",
    "fill": props.colors[0]
  }, null), _createVNode("circle", {
    "cx": "24",
    "cy": "24",
    "r": "3",
    "fill": props.colors[0]
  }, null), _createVNode("circle", {
    "cx": "24",
    "cy": "35",
    "r": "3",
    "fill": props.colors[0]
  }, null)]);
});