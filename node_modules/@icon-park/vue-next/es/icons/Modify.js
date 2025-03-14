import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('modify', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M20.0708 9.58588L15.8282 5.34324C15.0472 4.56219 13.7808 4.56219 12.9998 5.34324L7.34292 11.0001C6.56188 11.7811 6.56188 13.0475 7.34292 13.8285L11.5856 18.0712",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M28.9287 37.4143L33.1714 41.6569C33.9524 42.438 35.2187 42.438 35.9998 41.6569L41.6566 36.0001C42.4377 35.219 42.4377 33.9527 41.6566 33.1717L37.414 28.929",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("rect", {
    "x": "34.6064",
    "y": "4.9082",
    "width": "12",
    "height": "42",
    "rx": "2",
    "transform": "rotate(45 34.6064 4.9082)",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("circle", {
    "cx": "24",
    "cy": "24",
    "r": "2",
    "fill": props.colors[2]
  }, null), _createVNode("circle", {
    "cx": "20",
    "cy": "28",
    "r": "2",
    "fill": props.colors[2]
  }, null), _createVNode("circle", {
    "cx": "28",
    "cy": "20",
    "r": "2",
    "fill": props.colors[2]
  }, null)]);
});