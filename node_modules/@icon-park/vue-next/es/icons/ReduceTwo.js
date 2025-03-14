import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('reduce-two', false, function (props) {
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
    "d": "M17 30H12.4142C11.5233 30 11.0771 31.0771 11.7071 31.7071L16.2929 36.2929C16.9229 36.9229 18 36.4767 18 35.5858V31C18 30.4477 17.5523 30 17 30Z",
    "fill": props.colors[2]
  }, null), _createVNode("path", {
    "d": "M30 31V35.5858C30 36.4767 31.0771 36.9229 31.7071 36.2929L36.2929 31.7071C36.9229 31.0771 36.4767 30 35.5858 30H31C30.4477 30 30 30.4477 30 31Z",
    "fill": props.colors[2]
  }, null), _createVNode("path", {
    "d": "M31 18H35.5858C36.4767 18 36.9229 16.9229 36.2929 16.2929L31.7071 11.7071C31.0771 11.0771 30 11.5233 30 12.4142V17C30 17.5523 30.4477 18 31 18Z",
    "fill": props.colors[2]
  }, null), _createVNode("path", {
    "d": "M18 17V12.4142C18 11.5233 16.9229 11.0771 16.2929 11.7071L11.7071 16.2929C11.0771 16.9229 11.5233 18 12.4142 18H17C17.5523 18 18 17.5523 18 17Z",
    "fill": props.colors[2]
  }, null)]);
});