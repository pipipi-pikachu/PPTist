import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('speaker', false, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M38 2H10C8.89543 2 8 2.89543 8 4V44C8 45.1046 8.89543 46 10 46H38C39.1046 46 40 45.1046 40 44V4C40 2.89543 39.1046 2 38 2Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M24 38C27.3137 38 30 35.3137 30 32C30 28.6863 27.3137 26 24 26C20.6863 26 18 28.6863 18 32C18 35.3137 20.6863 38 24 38Z",
    "fill": props.colors[3],
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M24 18C26.2091 18 28 16.2091 28 14C28 11.7909 26.2091 10 24 10C21.7909 10 20 11.7909 20 14C20 16.2091 21.7909 18 24 18Z",
    "fill": props.colors[3],
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});