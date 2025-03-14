import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('orange', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M41 25.9999C41 35.9411 35 43.9999 24 43.9999C13 43.9999 7 35.9411 7 25.9999C7 22.3197 8.10446 18.8975 10 16.0465C13.2248 11.1965 17.7391 12.9999 24 12.9999C30.2609 12.9999 34.7752 11.1965 38 16.0465C39.8955 18.8975 41 22.3197 41 25.9999Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M26 13L29 9H26L24 7L22 9H19L22 13",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("circle", {
    "cx": "18",
    "cy": "20",
    "r": "2",
    "fill": props.colors[2]
  }, null), _createVNode("circle", {
    "cx": "15",
    "cy": "27",
    "r": "2",
    "fill": props.colors[2]
  }, null), _createVNode("circle", {
    "cx": "21",
    "cy": "25",
    "r": "2",
    "fill": props.colors[2]
  }, null), _createVNode("circle", {
    "cx": "18",
    "cy": "32",
    "r": "2",
    "fill": props.colors[2]
  }, null)]);
});