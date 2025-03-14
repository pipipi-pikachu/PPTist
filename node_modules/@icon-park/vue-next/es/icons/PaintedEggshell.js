import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('painted-eggshell', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    "d": "M24 44C34.2524 44 40 37.0457 40 26C40 14.9543 31.1316 4 24 4C16.8684 4 8 14.9543 8 26C8 37.0457 13.7476 44 24 44Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("path", {
    "d": "M21 38C22.6569 38 24 36.6569 24 35C24 33.3431 22.6569 32 21 32C19.3431 32 18 33.3431 18 35C18 36.6569 19.3431 38 21 38Z",
    "fill": props.colors[2]
  }, null), _createVNode("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    "d": "M16 29.6675C17.1046 29.6675 18 28.772 18 27.6675C18 26.5629 17.1046 25.6675 16 25.6675C14.8954 25.6675 14 26.5629 14 27.6675C14 28.772 14.8954 29.6675 16 29.6675Z",
    "fill": props.colors[2]
  }, null)]);
});