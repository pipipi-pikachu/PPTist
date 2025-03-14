import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('material-three', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M9 15V9.56389C9 8.67237 9.08702 8.34908 9.25044 8.02315C9.41385 7.69723 9.65365 7.44144 9.95921 7.26713C10.2648 7.09283 10.5678 7 11.4036 7H36.5964C37.4322 7 37.7352 7.09283 38.0408 7.26713C38.3463 7.44144 38.5862 7.69723 38.7496 8.02315C38.913 8.34908 39 8.67237 39 9.56389V15",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M5 15H43V41H5V15Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    "d": "M13 26C14.6569 26 16 24.6569 16 23C16 21.3431 14.6569 20 13 20C11.3431 20 10 21.3431 10 23C10 24.6569 11.3431 26 13 26Z",
    "fill": props.colors[0]
  }, null), _createVNode("path", {
    "d": "M5.56934 40.39L15.0004 30L20.0004 34L26.0004 27L42.3941 40.39",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});