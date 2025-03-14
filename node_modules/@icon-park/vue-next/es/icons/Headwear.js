import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('headwear', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M12.4167 43C10.095 40.0682 8 35.7788 8 31C8 22.1634 15.1634 15 24 15C32.8366 15 40 22.1634 40 31C40 35.7788 37.905 40.0682 35.5833 43",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M34 13.5L43 5L40 17L35 18L34 13.5Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M14 13.5L5 5L8 17L13 18L14 13.5Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});