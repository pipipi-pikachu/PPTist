import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('oceanengine', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M21.4826 8.47412L23.8804 16.6267H4.75781L7.21558 8.47412H21.4826Z",
    "fill": props.colors[0]
  }, null), _createVNode("path", {
    "d": "M9.1335 18.1254L17.3461 20.1036L7.81473 36.6485L2 30.4741L9.1335 18.1254Z",
    "fill": props.colors[0]
  }, null), _createVNode("path", {
    "d": "M11.292 33.6512L17.1067 27.4768L26.698 44.0218L18.4255 46L11.292 33.6512Z",
    "fill": props.colors[0]
  }, null), _createVNode("path", {
    "d": "M40.0652 39.4659H25.7982L23.4004 31.3733H42.523",
    "fill": props.colors[0]
  }, null), _createVNode("path", {
    "d": "M45.2806 17.466L38.1471 29.8747L29.9346 27.8965L39.4659 11.3515",
    "fill": props.colors[0]
  }, null), _createVNode("path", {
    "d": "M35.989 14.3488L30.1743 20.5232L20.583 3.91825L28.8555 2L35.989 14.3488Z",
    "fill": props.colors[0]
  }, null)]);
});