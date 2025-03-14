import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('fireworks', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M6 41.9999L14.6741 17.2639L31 34.0384L6 41.9999Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M23 19L28 14C30.6667 11.3333 31 9 29 7",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M29 25L34 20C37.3333 16.6667 40.6667 16.6667 44 20",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M20 7C21.1046 7 22 6.10457 22 5C22 3.89543 21.1046 3 20 3C18.8954 3 18 3.89543 18 5C18 6.10457 18.8954 7 20 7Z",
    "fill": props.colors[0]
  }, null), _createVNode("path", {
    "d": "M42 6C43.1046 6 44 5.10457 44 4C44 2.89543 43.1046 2 42 2C40.8954 2 40 2.89543 40 4C40 5.10457 40.8954 6 42 6Z",
    "fill": props.colors[0]
  }, null), _createVNode("path", {
    "d": "M42 29C43.1046 29 44 28.1046 44 27C44 25.8954 43.1046 25 42 25C40.8954 25 40 25.8954 40 27C40 28.1046 40.8954 29 42 29Z",
    "fill": props.colors[0]
  }, null), _createVNode("path", {
    "d": "M39 38C40.1046 38 41 37.1046 41 36C41 34.8954 40.1046 34 39 34C37.8954 34 37 34.8954 37 36C37 37.1046 37.8954 38 39 38Z",
    "fill": props.colors[0]
  }, null)]);
});