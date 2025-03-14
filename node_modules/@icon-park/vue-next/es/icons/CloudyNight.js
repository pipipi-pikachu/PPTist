import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('cloudy-night', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M9.45455 30.9942C6.14242 28.461 4 24.4278 4 19.8851C4 12.2166 10.1052 6 17.6364 6C23.9334 6 29.2336 10.3462 30.8015 16.2533C32.0353 15.6159 33.431 15.2567 34.9091 15.2567C39.9299 15.2567 44 19.4011 44 24.5135C44 28.3094 41.7562 31.5716 38.5455 33",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M27.2158 30.1233C25.5748 30.5511 24.3637 32.0432 24.3637 33.8182C24.3637 35.9269 26.0731 37.6364 28.1818 37.6364C29.9568 37.6364 31.4489 36.4252 31.8767 34.7842C31.9576 35.1768 32 35.5835 32 36C32 39.3137 29.3137 42 26 42C22.6863 42 20 39.3137 20 36C20 32.6863 22.6863 30 26 30C26.4166 30 26.8232 30.0424 27.2158 30.1233Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M22.2426 15.7574C21.1569 14.6716 19.6569 14 18 14C14.6863 14 12 16.6863 12 20C12 21.6569 12.6716 23.1569 13.7574 24.2426",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});