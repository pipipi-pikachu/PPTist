import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('quadrilateral', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M28.038 8H7C5.34315 8 4 9.34315 4 11V37C4 38.6569 5.34315 40 7 40H39.413C41.5764 40 43.0286 37.7796 42.1614 35.7975L30.7864 9.79754C30.3087 8.70558 29.2298 8 28.038 8Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null)]);
});