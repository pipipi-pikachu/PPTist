import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('endocrine', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    "d": "M23.1466 44C31.2933 44 40 43.0106 40 30.1802C40 23.9643 38.5085 18.9042 35.5256 15C32.7392 19.6667 30.674 22 29.3299 22C27.3139 22 29.3299 15.9107 26.9987 11.2914C25.4445 8.21194 22.6879 5.78146 18.7289 4C19.2794 8.43691 19.1603 11.6554 18.3715 13.6554C17.1882 16.6554 7.15114 21.91 8.05783 30.9349C8.96453 39.9599 15 44 23.1466 44Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M21.7076 24.0083C17.9028 27.4666 16.2811 30.6674 16.8427 33.6109C17.3261 36.1448 19.2487 37.3764 20.6969 37.7735C21.8196 38.0814 23.7635 38.2536 25.5004 36.7067C27.3402 35.0682 26.6071 32.7388 23.9392 29.8571C22.8138 28.6415 22.0699 26.6919 21.7076 24.0083Z",
    "fill": props.colors[3],
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});