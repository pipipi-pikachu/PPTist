import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('messages-one', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M39 6H9C7.34315 6 6 7.34315 6 9V39C6 40.6569 7.34315 42 9 42H39C40.6569 42 42 40.6569 42 39V9C42 7.34315 40.6569 6 39 6Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("path", {
    "d": "M34 23C34 26.8624 31.2967 30.1565 27.5 31.4334C26.4107 31.7997 25.2313 32 24 32C20 32 15 34 15 34L16.1323 31.5543C16.6952 30.3384 16.336 28.9248 15.5616 27.8314C14.5729 26.4356 14 24.778 14 23C14 18.0294 18.4772 14 24 14C29.5228 14 34 18.0294 34 23Z",
    "fill": props.colors[3],
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});