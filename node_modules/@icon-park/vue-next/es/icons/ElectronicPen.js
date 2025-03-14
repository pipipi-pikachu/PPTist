import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('electronic-pen', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("g", {
    "clip-path": 'url(#' + props.id + '49e6bff9' + ')'
  }, [_createVNode("rect", {
    "x": "35.1926",
    "y": "5.32227",
    "width": "12",
    "height": "38",
    "rx": "6",
    "transform": "rotate(45 35.1926 5.32227)",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("path", {
    "d": "M18 23L26 31",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M6 43L12 37",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("rect", {
    "x": "33.2681",
    "y": "12.3396",
    "width": "4",
    "height": "4",
    "rx": "2",
    "transform": "rotate(30 33.2681 12.3396)",
    "fill": props.colors[2]
  }, null)]), _createVNode("defs", null, [_createVNode("clipPath", {
    "id": props.id + '49e6bff9'
  }, [_createVNode("rect", {
    "width": "48",
    "height": "48",
    "fill": props.colors[2]
  }, null)])])]);
});