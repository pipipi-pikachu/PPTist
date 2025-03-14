import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('fist', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M34 41C28.1693 44.1747 21.5 43.5 18 42C14.5 40.5 6 35.5 6 27C6 22.7533 11.7711 20.6707 13.51 20.1396C13.7979 20.0517 14 19.7888 14 19.4878V12C14 10.067 15.567 8.5 17.5 8.5C19.433 8.5 21 10.067 21 12V9.49999C21 7.567 22.567 6 24.5 6C26.433 6 28 7.567 28 9.49999V12C28 10.067 29.567 8.5 31.5 8.5C33.433 8.5 35 10.067 35 12L35 16.4931C35.0037 14.5633 36.5693 13 38.5 13C40.433 13 42 14.5631 42 16.4961V30C42 34 38.13 38.7513 34 41Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});