import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('sound-one', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M9 7C9 5.34315 10.3431 4 12 4H36C37.6569 4 39 5.34315 39 7V41C39 42.6569 37.6569 44 36 44H12C10.3431 44 9 42.6569 9 41L9 7Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("path", {
    "d": "M24 29C27.866 29 31 25.866 31 22C31 18.134 27.866 15 24 15C20.134 15 17 18.134 17 22C17 25.866 20.134 29 24 29Z",
    "fill": props.colors[3],
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("rect", {
    "x": "30",
    "y": "8",
    "width": "4",
    "height": "4",
    "rx": "2",
    "fill": props.colors[2]
  }, null), _createVNode("path", {
    "d": "M27 36H29",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M19 36H21",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});