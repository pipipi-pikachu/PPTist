import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('watch', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M34.9562 31L30.9998 44H16.9998L13.0435 31",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M13.0435 17L16.9998 4H30.9998L34.9562 17",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M37 24C37 26.5773 36.25 28.9794 34.9564 31C32.6462 34.6083 28.6024 37 24 37C19.3976 37 15.3538 34.6083 13.0436 31C11.75 28.9794 11 26.5773 11 24C11 21.4227 11.75 19.0206 13.0436 17C15.3538 13.3917 19.3976 11 24 11C28.6024 11 32.6462 13.3917 34.9564 17C36.25 19.0206 37 21.4227 37 24Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M24 17V24L28 28",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});