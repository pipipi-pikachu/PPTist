import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('diamond-two', false, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M8.92349 22.7879L22.4091 5.08801C23.2096 4.03746 24.7904 4.03746 25.5909 5.08801L39.0765 22.7879C39.622 23.5039 39.622 24.4961 39.0765 25.2121L25.5909 42.912C24.7904 43.9625 23.2096 43.9625 22.4091 42.912L8.92349 25.2121C8.37798 24.4961 8.37798 23.5039 8.92349 22.7879Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null)]);
});