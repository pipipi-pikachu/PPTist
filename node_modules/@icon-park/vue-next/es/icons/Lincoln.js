import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('lincoln', false, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M30.19 4H17.81C16.7825 4 15.9221 4.77859 15.8199 5.80099L14.0199 23.801C14.0067 23.9333 14.0067 24.0667 14.0199 24.199L15.8199 42.199C15.9221 43.2214 16.7825 44 17.81 44H30.19C31.2175 44 32.0779 43.2214 32.1801 42.199L33.9801 24.199C33.9933 24.0667 33.9933 23.9333 33.9801 23.801L32.1801 5.80099C32.0779 4.77859 31.2175 4 30.19 4Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("path", {
    "d": "M14 24L34 24",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null), _createVNode("path", {
    "d": "M24 4V44",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null), _createVNode("path", {
    "d": "M20 4H28",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null), _createVNode("path", {
    "d": "M20 44H28",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null), _createVNode("path", {
    "d": "M15 14L14.0199 23.801C14.0067 23.9333 14.0067 24.0667 14.0199 24.199L15 34",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null), _createVNode("path", {
    "d": "M33 14L33.9801 23.801C33.9933 23.9333 33.9933 24.0667 33.9801 24.199L33 34",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null)]);
});