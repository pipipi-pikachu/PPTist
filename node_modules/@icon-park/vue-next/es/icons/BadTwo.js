import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('bad-two', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M4.18051 26.8339C4.08334 27.9999 5.00352 29 6.1736 29H10C11.1046 29 12 28.1046 12 27V7C12 5.89543 11.1046 5 10 5H7.84027C6.80009 5 5.93356 5.79733 5.84717 6.83391L4.18051 26.8339Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M18 26.6255C18 27.4612 18.5194 28.2092 19.2753 28.5655C20.9238 29.3426 23.7329 30.9062 25 33.0195C26.6331 35.7431 26.9411 40.664 26.9912 41.7912C26.9982 41.949 26.9937 42.107 27.0154 42.2634C27.2861 44.2155 31.0543 41.9351 32.5 39.5239C33.2846 38.2153 33.3852 36.496 33.3027 35.1537C33.2144 33.7175 32.7933 32.3301 32.3802 30.9517L31.5 28.0155H42.3569C43.6832 28.0155 44.6421 26.7482 44.2816 25.4719L38.9113 6.45642C38.668 5.5949 37.8818 5 36.9866 5H20C18.8954 5 18 5.89543 18 7V26.6255Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});