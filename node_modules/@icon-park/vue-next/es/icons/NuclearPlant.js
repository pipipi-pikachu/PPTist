import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('nuclear-plant', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M4 44H44",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M12 14H36",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M14 14H24H34L34.8772 21.0175C34.9589 21.6709 35.1049 22.3147 35.3131 22.9394L38.6474 32.9422C38.8817 33.6452 39.0372 34.3721 39.1109 35.1095L40 44H8L8.88905 35.1095C8.96279 34.3721 9.11826 33.6452 9.35259 32.9422L12.6869 22.9394C12.8951 22.3147 13.0411 21.6709 13.1228 21.0175L14 14Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M24 8L24.8284 7.17157C25.5786 6.42143 26.596 6 27.6569 6H28.3431C29.404 6 30.4214 5.57857 31.1716 4.82843L32 4",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M17 31C17 32.8728 17.7354 34.5738 18.9333 35.83C19.5891 36.5178 20.3836 37.0722 21.2718 37.4484",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null), _createVNode("path", {
    "d": "M31.0004 31C31.0004 32.8728 30.2649 34.5738 29.0671 35.83C28.4112 36.5178 27.6168 37.0722 26.7285 37.4484",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null), _createVNode("path", {
    "d": "M18.9336 26.17C20.2085 24.8331 22.0071 24 24.0003 24C25.9935 24 27.7922 24.8331 29.067 26.17",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null), _createVNode("circle", {
    "cx": "24",
    "cy": "31",
    "r": "2",
    "fill": props.colors[2]
  }, null)]);
});