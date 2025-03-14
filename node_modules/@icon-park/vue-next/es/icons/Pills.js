import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('pills', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    "d": "M9.97315 22.0623L17.2506 15.9558L24.528 9.84929C28.9703 6.12177 35.5932 6.7012 39.3207 11.1435C43.0483 15.5858 42.4688 22.2087 38.0265 25.9362L30.7491 32.0427L23.4717 38.1492C19.0294 41.8767 12.4065 41.2973 8.67896 36.855C4.95144 32.4127 5.53087 25.7898 9.97315 22.0623Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("path", {
    "d": "M19.6885 21.8613L25.4261 28.6992",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});