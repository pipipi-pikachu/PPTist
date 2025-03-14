import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('disabled-picture', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M44 23.999C44 22.8945 43.1046 21.999 42 21.999C40.8954 21.999 40 22.8945 40 23.999H44ZM24 7.99902C25.1046 7.99902 26 7.10359 26 5.99902C26 4.89445 25.1046 3.99902 24 3.99902V7.99902ZM39 39.999H9V43.999H39V39.999ZM8 38.999V8.99902H4V38.999H8ZM40 23.999V38.999H44V23.999H40ZM9 7.99902H24V3.99902H9V7.99902ZM9 39.999C8.44772 39.999 8 39.5513 8 38.999H4C4 41.7604 6.23857 43.999 9 43.999V39.999ZM39 43.999C41.7614 43.999 44 41.7604 44 38.999H40C40 39.5513 39.5523 39.999 39 39.999V43.999ZM8 8.99902C8 8.44674 8.44771 7.99902 9 7.99902V3.99902C6.23858 3.99902 4 6.2376 4 8.99902H8Z",
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
  }, null), _createVNode("circle", {
    "cx": "36",
    "cy": "12",
    "r": "6",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("path", {
    "d": "M32 8L40 16",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});