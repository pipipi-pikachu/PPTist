import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('hands', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("circle", {
    "cx": "24",
    "cy": "13",
    "r": "9",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M4.5 43.9994C4.5 38 11.5 27.9994 24 27.9994C24 27.9994 24 27.9994 24 27.9994C24 27.9994 26.7588 27.9994 29.7821 29.0906C32.7438 30.1596 36.5 31.1481 36.5 27.9994V27.9994V7.74952C36.5 5.67845 38.1789 3.99951 40.25 3.99951V3.99951C42.3211 3.99951 44 5.67844 44 7.74951V43.9994",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("path", {
    "d": "M2 44L46 44",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});