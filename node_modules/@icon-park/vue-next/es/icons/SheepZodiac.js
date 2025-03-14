import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('sheep-zodiac', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M4.99988 13.9998C3.49985 11.4998 2.99991 6 7.9999 4.99965C9.9999 4.85024 11.4999 5.50009 13.9999 7.99978L24.9999 19.9998L21.9999 23.9998",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M18.9999 14.0001C14.9286 14.7071 6.99997 18.0001 7.99997 28.0001C8.49997 31.0001 9.85917 33.9455 12.9999 37.0001V42.0001",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M29 16.9998C33.2213 16.5702 42.3115 17.4388 44 24.9998C44.5628 26.8615 44.0656 32.1575 39 38.0001V42.0001",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M33 42.0001C33 38.1341 29.6005 36.0001 26 36.0001C22.3995 36.0001 19 38.1341 19 42.0001",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null)]);
});