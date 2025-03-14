import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('frog', false, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M19.1015 10.8942C19.5261 11.6689 19.7431 12.5226 19.772 13.4061C20.9787 13.2453 22.2252 13.1611 23.5003 13.1611C25.1295 13.1611 26.7122 13.2986 28.2249 13.5577C28.2328 12.6203 28.4497 11.7131 28.8985 10.8942C30.6575 7.68502 35.3132 7.04762 39.2973 9.47057C43.2814 11.8935 45.0852 16.4593 43.3262 19.6685C42.8986 20.4486 42.2999 21.0768 41.5812 21.5459C42.4961 23.1006 43 24.8001 43 26.5806C43 33.9919 34.2697 40 23.5003 40C12.7308 40 4.00052 33.9919 4.00052 26.5806C4.00052 24.5994 4.62433 22.7186 5.74416 21.026C5.32121 20.6426 4.95932 20.1894 4.67378 19.6685C2.91478 16.4593 4.71859 11.8935 8.7027 9.47057C12.6868 7.04762 17.3425 7.68502 19.1015 10.8942Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("circle", {
    "cx": "12",
    "cy": "17",
    "r": "2",
    "fill": props.colors[2]
  }, null), _createVNode("circle", {
    "cx": "20.1562",
    "cy": "28.5762",
    "r": "2",
    "fill": props.colors[2]
  }, null), _createVNode("circle", {
    "cx": "28.1562",
    "cy": "28.5762",
    "r": "2",
    "fill": props.colors[2]
  }, null), _createVNode("circle", {
    "cx": "36",
    "cy": "17",
    "r": "2",
    "fill": props.colors[2]
  }, null)]);
});