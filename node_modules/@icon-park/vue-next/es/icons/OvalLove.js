import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('oval-love', false, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M29.5164 17.5001C35.0393 27.0659 34.4759 37.7307 28.2581 41.3206C22.0403 44.9104 12.5226 40.0659 6.99976 30.5001C1.47691 20.9342 2.04029 10.2694 8.25809 6.67962C14.4759 3.08977 23.9936 7.93428 29.5164 17.5001Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M18.2581 17.5001C12.7353 27.0659 13.2986 37.7307 19.5164 41.3206C25.7342 44.9104 35.2519 40.0659 40.7748 30.5001C46.2976 20.9342 45.7342 10.2694 39.5164 6.67962C33.2986 3.08977 23.7809 7.93428 18.2581 17.5001Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M23.7529 10.3442C25.8979 12.2519 27.8821 14.6692 29.5165 17.5C35.0394 27.0658 34.476 37.7306 28.2582 41.3205C26.96 42.07 25.518 42.4518 23.9986 42.4998",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});