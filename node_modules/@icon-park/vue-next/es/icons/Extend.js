import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('extend', false, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("rect", {
    "x": "6",
    "y": "6",
    "width": "36",
    "height": "36",
    "rx": "3",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("path", {
    "d": "M35 12H30.4142C29.5233 12 29.0771 13.0771 29.7071 13.7071L34.2929 18.2929C34.9229 18.9229 36 18.4767 36 17.5858V13C36 12.4477 35.5523 12 35 12Z",
    "fill": props.colors[2]
  }, null), _createVNode("path", {
    "d": "M12 13V17.5858C12 18.4767 13.0771 18.9229 13.7071 18.2929L18.2929 13.7071C18.9229 13.0771 18.4767 12 17.5858 12H13C12.4477 12 12 12.4477 12 13Z",
    "fill": props.colors[2]
  }, null), _createVNode("path", {
    "d": "M13 36H17.5858C18.4767 36 18.9229 34.9229 18.2929 34.2929L13.7071 29.7071C13.0771 29.0771 12 29.5233 12 30.4142V35C12 35.5523 12.4477 36 13 36Z",
    "fill": props.colors[2]
  }, null), _createVNode("path", {
    "d": "M36 35V30.4142C36 29.5233 34.9229 29.0771 34.2929 29.7071L29.7071 34.2929C29.0771 34.9229 29.5233 36 30.4142 36H35C35.5523 36 36 35.5523 36 35Z",
    "fill": props.colors[2]
  }, null)]);
});