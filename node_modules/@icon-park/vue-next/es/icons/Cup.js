import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('cup', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 49 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M8.77783 17.012C8.77783 16.4531 9.23094 16 9.78988 16H33.7658C34.3247 16 34.7778 16.4531 34.7778 17.012V31C34.7778 38.1797 28.9575 44 21.7778 44V44C14.5981 44 8.77783 38.1797 8.77783 31V17.012Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("rect", {
    "x": "8.77783",
    "y": "23",
    "width": "26",
    "height": "8",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M21.7778 4V10",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M13.7778 6V8",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M29.7778 6V8",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M34.7778 34C38.6438 34 41.7778 30.866 41.7778 27C41.7778 23.134 38.6438 20 34.7778 20",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null)]);
});