import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('leo', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("circle", {
    "cx": "13",
    "cy": "26.9998",
    "r": "6",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("path", {
    "d": "M13 20.9999C13 15.5002 15 5.00024 24 5.00024C28.5 5.00024 36.7205 7.33192 33.5358 20.5613C33.2552 21.7271 32.154 23.9747 32.154 23.9747L30.5501 27.5773C28.8914 30.918 26.748 39.4542 33.5358 42.6106C35.5941 43.5678 40.0171 42.9496 41 38.6017",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});