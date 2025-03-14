import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('deer', false, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M36 27C36 34.2165 30.6274 44 24 44C17.3726 44 12 34.2165 12 27C12 19.7835 13.5 16 24 16C34.5 16 36 19.7835 36 27Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("ellipse", {
    "rx": "5",
    "ry": "3.5",
    "transform": "matrix(0.707107 -0.707107 -0.707107 -0.707107 38.9996 17.5003)",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("ellipse", {
    "cx": "8.99963",
    "cy": "17.4997",
    "rx": "5",
    "ry": "3.5",
    "transform": "rotate(45 8.99963 17.4997)",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("path", {
    "d": "M12 4C12 10.6274 17.3726 16 24 16C30.6274 16 36 10.6274 36 4",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null), _createVNode("path", {
    "d": "M18 7C18 11.9706 20.6863 16 24 16C27.3137 16 30 11.9706 30 7",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null), _createVNode("circle", {
    "cx": "19.9995",
    "cy": "26",
    "r": "2",
    "fill": props.colors[2]
  }, null), _createVNode("circle", {
    "cx": "23.9995",
    "cy": "34",
    "r": "2",
    "fill": props.colors[2]
  }, null), _createVNode("circle", {
    "cx": "27.9995",
    "cy": "26",
    "r": "2",
    "fill": props.colors[2]
  }, null)]);
});