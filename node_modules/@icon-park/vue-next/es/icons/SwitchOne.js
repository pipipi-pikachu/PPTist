import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('switch-one', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("circle", {
    "cx": "24",
    "cy": "24",
    "r": "19",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("rect", {
    "x": "36.0063",
    "y": "19.3335",
    "width": "10.5189",
    "height": "24.0125",
    "rx": "5.25944",
    "transform": "rotate(90 36.0063 19.3335)",
    "fill": props.colors[3],
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("rect", {
    "x": "36.0063",
    "y": "29.8525",
    "width": "10",
    "height": "10",
    "rx": "5",
    "transform": "rotate(-180 36.0063 29.8525)",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth
  }, null)]);
});