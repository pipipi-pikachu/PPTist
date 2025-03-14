import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('city-gate', false, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M15 11H32C32 11 37.0476 13.9664 39 15C40.0914 15.5778 44 16 44 16C44 16 42.1839 16.6487 41 17C39.4563 17.458 37 18 37 18H24H11C11 18 8.54366 17.458 7 17C5.81607 16.6487 4 16 4 16C4 16 7.90857 15.5778 9 15C10.9524 13.9664 15 11 15 11Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M17 11L24 4L30 11H17Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M35 18V24",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("path", {
    "d": "M12 18V24",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("path", {
    "d": "M4 44L6 24H42L44 44H4Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M20 38C20 35.7909 21.7909 34 24 34V34C26.2091 34 28 35.7909 28 38V44H20V38Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null)]);
});