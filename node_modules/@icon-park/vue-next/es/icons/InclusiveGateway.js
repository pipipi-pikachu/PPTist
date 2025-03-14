import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('inclusive-gateway', false, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M22.7992 4.20102L4.4144 22.5858C3.63336 23.3668 3.63335 24.6332 4.4144 25.4142L22.7992 43.799C23.5802 44.58 24.8466 44.58 25.6276 43.799L44.0124 25.4142C44.7934 24.6332 44.7934 23.3668 44.0124 22.5858L25.6276 4.20102C24.8466 3.41997 23.5802 3.41997 22.7992 4.20102Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M24 32C28.4183 32 32 28.4183 32 24C32 19.5817 28.4183 16 24 16C19.5817 16 16 19.5817 16 24C16 28.4183 19.5817 32 24 32Z",
    "fill": props.colors[3],
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});