import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('minus-the-bottom', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M5 41V21C5 19.8954 5.89543 19 7 19H17C18.1046 19 19 19.8954 19 21V27C19 28.1046 19.8954 29 21 29H27C28.1046 29 29 29.8954 29 31V41C29 42.1046 28.1046 43 27 43H7C5.89543 43 5 42.1046 5 41Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M19 27V7C19 5.89543 19.8954 5 21 5H41C42.1046 5 43 5.89543 43 7V27C43 28.1046 42.1046 29 41 29H21C19.8954 29 19 28.1046 19 27Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});