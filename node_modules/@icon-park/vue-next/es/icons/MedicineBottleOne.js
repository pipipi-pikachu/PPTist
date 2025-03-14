import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('medicine-bottle-one', false, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M13 7C13 5.34315 14.3431 4 16 4H32C33.6569 4 35 5.34315 35 7C35 8.65685 33.6569 10 32 10H16C14.3431 10 13 8.65685 13 7Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M13.0993 17.1208C13.6688 16.4122 14.5288 16 15.4379 16H32.5621C33.4712 16 34.3312 16.4122 34.9007 17.1208L39.3385 22.6435C39.7666 23.1763 40 23.8392 40 24.5227V41C40 42.6569 38.6569 44 37 44H11C9.34315 44 8 42.6569 8 41V24.5227C8 23.8392 8.23337 23.1763 8.66147 22.6435L13.0993 17.1208Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M18 30L30 30",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M24 24V36",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});