import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('take-off-one', false, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("g", {
    "clip-path": 'url(#' + props.id + '4c03515c' + ')'
  }, [_createVNode("path", {
    "d": "M4.99707 40.9883L42.9971 40.9883",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M8.52068 31.2641L3.90765 23.2741C4.87794 22.7139 9.67924 24.3889 11.4666 25.3061L21.1686 21.8332L12.8733 7.46538L16.9879 7.21842L30.3885 19.6798L38.6389 17.0682C42.2926 16.023 43.4449 18.0188 43.675 18.4175C45.0577 20.8123 42.2639 22.4252 41.8648 22.6556C38.672 24.499 8.52068 31.2641 8.52068 31.2641Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]), _createVNode("defs", null, [_createVNode("clipPath", {
    "id": props.id + '4c03515c'
  }, [_createVNode("rect", {
    "width": "48",
    "height": "48",
    "fill": props.colors[2]
  }, null)])])]);
});