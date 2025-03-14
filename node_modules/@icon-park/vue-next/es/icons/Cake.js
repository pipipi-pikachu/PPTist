import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('cake', false, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M24 12V17",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M8 27V40C8 41.1046 8.89543 42 10 42H38C39.1046 42 40 41.1046 40 40V27",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M4 21.9691C4 19.2247 6.22474 17 8.96909 17H39.0309C41.7753 17 44 19.2247 44 21.9691V22.2481C44 24.1115 42.8655 25.7871 41.1355 26.4791C40.3093 26.8096 39.3797 26.7613 38.5923 26.3468L38.25 26.1667C37.2589 25.645 36.0744 25.645 35.0833 26.1667C34.0922 26.6883 32.9078 26.6883 31.9167 26.1667C30.9256 25.645 29.7411 25.645 28.75 26.1667C27.7589 26.6883 26.5744 26.6883 25.5833 26.1667C24.5922 25.645 23.4078 25.645 22.4167 26.1667C21.4256 26.6883 20.2411 26.6883 19.25 26.1667C18.2589 25.645 17.0744 25.645 16.0833 26.1667C15.0922 26.6883 13.9078 26.6883 12.9167 26.1667C11.9256 25.645 10.7411 25.645 9.75 26.1667L9.40772 26.3468C8.62028 26.7613 7.69073 26.8096 6.86453 26.4791C5.13445 25.7871 4 24.1115 4 22.2481V21.9691Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M27 8C26.2 4 24.0001 4 24.0001 4C24.0001 4 21.8008 4 21.0008 8C20.0008 13 28 13 27 8Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null)]);
});