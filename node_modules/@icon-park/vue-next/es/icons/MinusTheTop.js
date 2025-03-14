import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('minus-the-top', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M5 41V21C5 19.8954 5.89543 19 7 19H19H27C28.1046 19 29 19.8954 29 21V29V41C29 42.1046 28.1046 43 27 43H7C5.89543 43 5 42.1046 5 41Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M43 7V27C43 28.1046 42.1046 29 41 29H31C29.8954 29 29 28.1046 29 27V21C29 19.8954 28.1046 19 27 19H21C19.8954 19 19 18.1046 19 17V7C19 5.89543 19.8954 5 21 5H41C42.1046 5 43 5.89543 43 7Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});