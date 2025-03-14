import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('cool', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M19 41C13.5 38.25 8.00129 31 5.00063 26C1.99996 21 8.3132 16.3125 12.0004 20C15.6876 23.6875 16.0004 24 16.0004 24V7.50001C16.0004 5.56701 17.5674 4 19.5004 4C21.4334 4 23.0004 5.56701 23.0004 7.50001V17C23.0004 15.067 24.5674 13.5 26.5004 13.5C28.4334 13.5 30.0004 15.067 30.0004 17V18.5C30.0004 16.567 31.5674 15 33.5004 15C35.4334 15 37.0004 16.567 37.0004 18.5V13.5C37.0004 11.567 38.5674 10 40.5004 10C42.4334 10 44.0004 11.567 44.0004 13.5V30.115C44.0004 32.0123 43.5785 33.9039 42.4268 35.4116C41.1327 37.1056 39.0179 39.3539 36 41C30.4999 44 24.5 43.75 19 41Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});