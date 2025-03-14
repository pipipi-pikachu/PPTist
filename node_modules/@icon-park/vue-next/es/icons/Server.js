import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('server', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M44 4H4V20H44V4Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M44 28H4V44H44V28Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M13 10H11C10.4477 10 10 10.4477 10 11V13C10 13.5523 10.4477 14 11 14H13C13.5523 14 14 13.5523 14 13V11C14 10.4477 13.5523 10 13 10Z",
    "fill": props.colors[2]
  }, null), _createVNode("path", {
    "d": "M13 34H11C10.4477 34 10 34.4477 10 35V37C10 37.5523 10.4477 38 11 38H13C13.5523 38 14 37.5523 14 37V35C14 34.4477 13.5523 34 13 34Z",
    "fill": props.colors[2]
  }, null), _createVNode("path", {
    "d": "M21 10H19C18.4477 10 18 10.4477 18 11V13C18 13.5523 18.4477 14 19 14H21C21.5523 14 22 13.5523 22 13V11C22 10.4477 21.5523 10 21 10Z",
    "fill": props.colors[2]
  }, null), _createVNode("path", {
    "d": "M21 34H19C18.4477 34 18 34.4477 18 35V37C18 37.5523 18.4477 38 19 38H21C21.5523 38 22 37.5523 22 37V35C22 34.4477 21.5523 34 21 34Z",
    "fill": props.colors[2]
  }, null)]);
});