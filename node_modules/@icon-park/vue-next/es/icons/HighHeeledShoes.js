import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('high-heeled-shoes', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M29.1829 20C31.264 15.0536 36.3505 10.6667 39 8C40.1039 8.66667 44 10.6037 44 15C44 19 42.5455 22.1111 41 23L35.0127 27.1911C32.3672 29.0429 30.1414 31.4311 28.48 34.2001L25 40H4V36C6.42869 34.6667 13.8206 30.1333 17 28C24 32 27.5 24 29.1829 20Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M43 21V40",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});