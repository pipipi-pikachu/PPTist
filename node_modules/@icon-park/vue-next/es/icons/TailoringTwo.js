import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('tailoring-two', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M42 5H37.4142C36.5233 5 36.0771 6.07714 36.7071 6.70711L41.2929 11.2929C41.9229 11.9229 43 11.4767 43 10.5858V6C43 5.44772 42.5523 5 42 5Z",
    "fill": props.colors[0]
  }, null), _createVNode("path", {
    "d": "M8 43H12.5858C13.4767 43 13.9229 41.9229 13.2929 41.2929L8.70711 36.7071C8.07714 36.0771 7 36.5233 7 37.4142L7 42C7 42.5523 7.44772 43 8 43Z",
    "fill": props.colors[0]
  }, null), _createVNode("path", {
    "d": "M14 4V32C14 33.1046 14.8954 34 16 34H44",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M21 13H35V27",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M14 13H6",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null), _createVNode("path", {
    "d": "M36 42V34",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null)]);
});