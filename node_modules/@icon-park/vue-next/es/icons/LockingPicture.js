import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('locking-picture', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M44 26C44 24.8954 43.1046 24 42 24C40.8954 24 40 24.8954 40 26H44ZM24 8C25.1046 8 26 7.10457 26 6C26 4.89543 25.1046 4 24 4V8ZM39 40H9V44H39V40ZM8 39V9H4V39H8ZM40 26V39H44V26H40ZM9 8H24V4H9V8ZM9 40C8.44772 40 8 39.5523 8 39H4C4 41.7614 6.23857 44 9 44V40ZM39 44C41.7614 44 44 41.7614 44 39H40C40 39.5523 39.5523 40 39 40V44ZM8 9C8 8.44772 8.44771 8 9 8V4C6.23858 4 4 6.23857 4 9H8Z",
    "fill": props.colors[0]
  }, null), _createVNode("path", {
    "d": "M6 35L16.6931 25.198C17.4389 24.5143 18.5779 24.4953 19.3461 25.1538L32 36",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M28 31L32.7735 26.2265C33.4772 25.5228 34.5914 25.4436 35.3877 26.0408L42 31",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("rect", {
    "x": "30",
    "y": "12",
    "width": "12",
    "height": "8",
    "rx": "3",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M36 6C37.6569 6 39 7.34315 39 9L39 12L33 12L33 9C33 7.34315 34.3431 6 36 6Z",
    "fill": props.colors[1]
  }, null), _createVNode("path", {
    "d": "M39 12L39 14C40.1046 14 41 13.1046 41 12L39 12ZM33 12L31 12C31 13.1046 31.8954 14 33 14L33 12ZM37 9L37 12L41 12L41 9L37 9ZM39 10L33 10L33 14L39 14L39 10ZM35 12L35 9L31 9L31 12L35 12ZM35 9C35 8.44772 35.4477 8 36 8L36 4C33.2386 4 31 6.23858 31 9L35 9ZM41 9C41 6.23858 38.7614 4 36 4L36 8C36.5523 8 37 8.44772 37 9L41 9Z",
    "fill": props.colors[0]
  }, null)]);
});