import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('battery-failure', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("rect", {
    "x": "14",
    "y": "44",
    "width": "36",
    "height": "20",
    "rx": "2",
    "transform": "rotate(-90 14 44)",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M20 6L20 4C20 2.89543 20.8954 2 22 2L26 2C27.1046 2 28 2.89543 28 4L28 6L20 6Z",
    "fill": props.colors[0]
  }, null), _createVNode("path", {
    "d": "M24 30V27C26.2091 27 28 24.9853 28 22.5C28 20.0147 26.2091 18 24 18C21.7909 18 20 20.0147 20 22.5",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M26 35.5C26 36.6046 25.1046 37.5 24 37.5C22.8954 37.5 22 36.6046 22 35.5C22 34.3954 22.8954 33.5 24 33.5C25.1046 33.5 26 34.3954 26 35.5Z",
    "fill": props.colors[2],
    "stroke": props.colors[2]
  }, null)]);
});