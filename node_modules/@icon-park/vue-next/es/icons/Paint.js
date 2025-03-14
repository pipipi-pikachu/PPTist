import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('paint', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M14.9897 22.6108L24.8892 32.5103",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M14.9897 22.6108L6.50447 31.0961C3.7708 33.8298 3.7708 38.2619 6.50447 40.9956V40.9956C9.23814 43.7293 13.6703 43.7293 16.404 40.9956L24.8892 32.5103",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M14.9897 32.5103L10.7471 36.7529",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M24.8892 32.5102L39.7966 26.0778C42.4838 24.9183 43.605 21.6988 41.8821 19.3331C37.7183 13.6159 32.1049 8.60333 27.9636 5.53585C25.6741 3.83998 22.6337 4.8951 21.5049 7.51115L14.9897 22.6107L24.8892 32.5102Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});