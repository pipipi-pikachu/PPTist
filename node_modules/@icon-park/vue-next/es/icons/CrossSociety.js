import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('cross-society', false, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M7 18H18V7C18 5.89543 18.8954 5 20 5H28C29.1046 5 30 5.89543 30 7V18H41C42.1046 18 43 18.8954 43 20V28C43 29.1046 42.1046 30 41 30H30V41C30 42.1046 29.1046 43 28 43H20C18.8954 43 18 42.1046 18 41V30H7C5.89543 30 5 29.1046 5 28V20C5 18.8954 5.89543 18 7 18Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});