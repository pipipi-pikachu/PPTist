import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('macadamia-nut', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M24 43C34.4934 43 43 34.9411 43 25H35L32 28L29 25H5C5 34.9411 13.5066 43 24 43Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M40.9451 25C41.0686 24.1847 40.9451 23.3499 40.9451 22.5C40.9451 13.3873 33.5817 5 24.4985 5C20.6757 5 16.1607 6.30854 13.3678 8.50352C13.7906 9.23816 14.0325 10.0907 14.0325 11C14.0325 13.7614 11.8012 16 9.04873 16C8.69904 16 8.35776 15.9639 8.0284 15.8951C7.39854 17.645 7.0552 20.5323 7.0552 22.5C7.0552 23.3499 6.93127 24.1847 7.05479 25",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M6 31H16",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});