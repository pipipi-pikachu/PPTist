import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('future-build-two', false, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M4 44H44",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("ellipse", {
    "cx": "24.5",
    "cy": "7",
    "rx": "13.5",
    "ry": "3",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("path", {
    "d": "M16 9C16 9 20.1593 17.8828 21 24C22.0687 31.7763 20 44 20 44",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("path", {
    "d": "M32.2266 9C32.2266 9 28.0673 17.8828 27.2266 24C26.1578 31.7763 28.0006 44 28.0006 44",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null)]);
});