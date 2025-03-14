import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('upload', false, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("mask", {
    "id": props.id + '04cec2fa',
    "maskUnits": "userSpaceOnUse",
    "x": "0",
    "y": "0",
    "width": "48",
    "height": "48",
    "style": {
      maskType: 'alpha'
    }
  }, [_createVNode("path", {
    "d": "M48 0H0V48H48V0Z",
    "fill": props.colors[2]
  }, null)]), _createVNode("g", {
    "mask": 'url(#' + props.id + '04cec2fa' + ')'
  }, [_createVNode("path", {
    "d": "M6 24.0083V42H42V24",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M33 15L24 6L15 15",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M23.9917 32V6",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)])]);
});