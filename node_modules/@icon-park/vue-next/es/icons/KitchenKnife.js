import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('kitchen-knife', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M14 30C14 30 14 34 14 40C14 46 22 46 22 40C22 34 22 30 22 30",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M22 37H14",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M14 6C14 4.89543 14.8954 4 16 4H32.6349C32.9537 4 33.2672 4.07486 33.5228 4.26546C34.5417 5.0254 37.1977 7.58171 38 14C38.7728 20.1822 36.6313 26.3644 35.6182 28.8547C35.3295 29.5645 34.6334 30 33.8672 30H14V6Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("circle", {
    "cx": "22",
    "cy": "10",
    "r": "2",
    "fill": props.colors[2]
  }, null)]);
});