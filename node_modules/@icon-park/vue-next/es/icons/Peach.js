import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('peach', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M10.0772 13.4315C15.0471 7.87006 23.6868 10.3148 27 12.0001C28.6566 11.3681 33.1972 10.6427 36.1791 12.6651C39.9065 15.193 44.6027 21.9042 40.2542 31.3839C36.7753 38.9676 27.689 42.1575 24.3758 43.0001C21.8909 41.9468 16.4303 39.832 10.6066 34.5519C5.32574 29.764 3.86498 20.3833 10.0772 13.4315Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M27 12C25.0761 12.75 21.2283 14.25 19.1295 18.75C16.8741 23.586 18.6048 27.75 19.1295 30",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M21 4C21.3333 4.16667 23.5 4.5 24 6.5C24.4372 8.24895 23.6667 9.33333 23.5 10.5",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null), _createVNode("path", {
    "d": "M28.479 11.3285C27.5253 11.2955 26.8667 10.455 27.0628 9.52106C27.3331 8.23362 27.9454 6.47675 29.3295 5.39228C30.7135 4.3078 32.5658 4.13344 33.8806 4.17892C34.8343 4.21191 35.4929 5.05244 35.2968 5.98635C35.0265 7.2738 34.4141 9.03066 33.0301 10.1151C31.646 11.1996 29.7937 11.374 28.479 11.3285Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null)]);
});