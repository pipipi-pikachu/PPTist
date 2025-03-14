import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('goblet-one', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("g", {
    "clip-path": 'url(#' + props.id + '5b91b0bd' + ')'
  }, [_createVNode("path", {
    "d": "M5.73633 24.1211L10.6861 29.0709C15.7629 34.1477 23.9941 34.1477 29.0709 29.0709V29.0709C34.1477 23.994 34.1477 15.7629 29.0709 10.6861L24.1211 5.73632",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M30 29.9998L35.9998 35.9998",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-miterlimit": "2",
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("ellipse", {
    "cx": "13.9996",
    "cy": "13.9998",
    "rx": "13",
    "ry": "7",
    "transform": "rotate(-45 13.9996 13.9998)",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("ellipse", {
    "cx": "37.9997",
    "cy": "37.9998",
    "rx": "6",
    "ry": "3",
    "transform": "rotate(-45 37.9997 37.9998)",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null)]), _createVNode("defs", null, [_createVNode("clipPath", {
    "id": props.id + '5b91b0bd'
  }, [_createVNode("rect", {
    "width": "48",
    "height": "48",
    "fill": props.colors[2]
  }, null)])])]);
});