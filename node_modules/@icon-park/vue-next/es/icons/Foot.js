import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('foot', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M19 8C20.7657 15.8788 21.7826 32.8365 13.3074 36.6184C12.8258 36.9335 11.1564 37.4693 7.68928 37.0911C5.68266 36.8722 3.40467 39.3542 6.56568 42.7639C7.34236 43.6016 9.06974 44.4657 13.3074 43.7093H21.0122C22.9384 43.7093 26.1166 41.3457 29.1985 35.6729C30.3221 34.0971 33.5324 30.8511 37.3848 30.4729C39.7926 30.3153 44.2228 28.3929 42.6819 21.9637C39.9259 15.5052 33.541 9.29458 32 4",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});