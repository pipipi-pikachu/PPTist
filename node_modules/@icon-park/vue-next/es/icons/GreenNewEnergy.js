import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('green-new-energy', false, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M42.3357 16C39.2495 8.93638 32.2012 4 23.9999 4C15.7986 4 8.75029 8.93638 5.66406 16",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M24 14C20.2973 17.6298 18 22.6881 18 28.2829C18 28.7833 18.0184 29.2795 18.0545 29.7708C21.7253 33.3967 24 38.4327 24 44C24 38.4327 26.2747 33.3967 29.9455 29.7708C29.9816 29.2795 30 28.7833 30 28.2829C30 22.6881 27.7027 17.6298 24 14Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M4 24C4 35.0457 12.9543 44 24 44C24 38.4327 21.7253 33.3967 18.0545 29.7708C14.4424 26.2027 9.47841 24 4 24Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M44 24C44 35.0457 35.0457 44 24 44C24 38.4327 26.2747 33.3967 29.9455 29.7708C33.5576 26.2027 38.5216 24 44 24Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});