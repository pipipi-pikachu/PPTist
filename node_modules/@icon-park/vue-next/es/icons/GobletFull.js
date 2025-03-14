import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('goblet-full', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M33 44H23H13",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M23 28V44",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M35 16C35 17.6751 34.6432 19.2839 34 20.7491C32.1475 24.9696 27.9194 28 23 28C18.2583 28 14.159 25.2498 12.21 21.2576C11.435 19.6699 11 17.8857 11 16C11 13.6271 11.5331 11.3874 12.21 9.5C13.3874 6.21729 15 4 15 4H31C31 4 32.8152 6.49591 34 10.1121C34.574 11.8639 35 13.8787 35 16Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M35 15.9998C35 15.9998 28 18.9998 23 15.9998C18 12.9998 11 15.9998 11 15.9998",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M34 10.1123C34.574 11.8642 35 13.8789 35 16.0002C35 17.6754 34.6432 19.2841 34 20.7494",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M12.21 9.5C11.5331 11.3874 11 13.6271 11 16C11 17.8857 11.435 19.6699 12.21 21.2576",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});