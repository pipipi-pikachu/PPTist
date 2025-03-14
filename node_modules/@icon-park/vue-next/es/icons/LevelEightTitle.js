import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('level-eight-title', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M6 8V40",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M24 8V40",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M7 24H23",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M37 29C39.2091 29 41 27.2091 41 25C41 22.7909 39.2091 21 37 21C34.7909 21 33 22.7909 33 25C33 27.2091 34.7909 29 37 29Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("path", {
    "d": "M37 40C39.7614 40 42 37.7614 42 35C42 32.2386 39.7614 30 37 30C34.2386 30 32 32.2386 32 35C32 37.7614 34.2386 40 37 40Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null)]);
});