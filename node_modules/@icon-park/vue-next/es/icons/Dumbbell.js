import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('dumbbell', false, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M14 13.6C14 12.1641 12.6569 11 11 11C9.34315 11 8 12.1641 8 13.6V34.4C8 35.8359 9.34315 37 11 37C12.6569 37 14 35.8359 14 34.4V13.6Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M40 13.6C40 12.1641 38.6569 11 37 11C35.3431 11 34 12.1641 34 13.6V34.4C34 35.8359 35.3431 37 37 37C38.6569 37 40 35.8359 40 34.4V13.6Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M8 18.6667C8 17.1939 6.65685 16 5 16C3.34315 16 2 17.1939 2 18.6667V29.3333C2 30.8061 3.34315 32 5 32C6.65685 32 8 30.8061 8 29.3333V18.6667Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M46 18.6667C46 17.1939 44.6569 16 43 16C41.3431 16 40 17.1939 40 18.6667V29.3333C40 30.8061 41.3431 32 43 32C44.6569 32 46 30.8061 46 29.3333V18.6667Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("rect", {
    "width": "20",
    "height": "6",
    "transform": "matrix(1 0 0 -1 14 27)",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});