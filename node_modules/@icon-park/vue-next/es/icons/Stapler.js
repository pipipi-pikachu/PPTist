import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('stapler', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M42 35V43H6V35H31",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M38.3839 21.8065L8.31372 10.8618L5.57756 18.3794L29.7533 27.1786",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M8.36963 10.7783L22.8821 16.1584C22.898 16.1643 22.9157 16.1562 22.9216 16.1403V16.1403C23.9362 13.4035 22.5401 10.3625 19.8033 9.34789L10.3014 5.82532C10.255 5.80811 10.2034 5.83179 10.1862 5.87821L8.36963 10.7783Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M16.7545 22.72L15.3865 26.4788C15.1976 26.9977 14.6237 27.2653 14.1047 27.0764L7.52689 24.6823C7.00791 24.4934 6.74033 23.9196 6.92922 23.4006L8.2973 19.6418",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("circle", {
    "cx": "36",
    "cy": "30",
    "r": "7",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null)]);
});