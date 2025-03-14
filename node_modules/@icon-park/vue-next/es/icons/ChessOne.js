import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('chess-one', false, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M40 44H8V40L14 37H34L40 40V44Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-miterlimit": "2",
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M14 19H34",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-miterlimit": "2",
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M27.74 19L33 37H15L20.26 19",
    "fill": props.colors[1]
  }, null), _createVNode("path", {
    "d": "M27.74 19L33 37H15L20.26 19",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-miterlimit": "2",
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M24 4C19.5817 4 16 7.58172 16 12C16 15.012 17.6646 17.6353 20.124 19H27.876C30.3354 17.6353 32 15.012 32 12C32 7.58172 28.4183 4 24 4Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null)]);
});