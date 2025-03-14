import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('zoom', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M20 43C15.2742 41.2327 11.3325 35.1851 9.35971 31.6428C8.50794 30.1134 8.95664 28.2347 10.3236 27.1411C11.8473 25.9222 14.0438 26.0438 15.4236 27.4236L17 29V20.5C17 19.1193 18.1193 18 19.5 18C20.8807 18 22 19.1193 22 20.5V16.5C22 15.1193 23.1193 14 24.5 14C25.8807 14 27 15.1193 27 16.5V24.5C27 23.1193 28.1193 22 29.5 22C30.8807 22 32 23.1193 32 24.5V27.5C32 26.1193 33.1193 25 34.5 25C35.8807 25 37 26.1193 37 27.5V35.368C37 36.4383 36.7354 37.496 36.1185 38.3707C35.0949 39.8219 33.255 42.0336 31 43C27.5 44.5 24.3701 44.6343 20 43Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M13 8L35 8",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M17.0003 12L13 8L17 4",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M31 4L35 8L31 12",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});