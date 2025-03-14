import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('chili', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("g", {
    "clip-path": 'url(#' + props.id + 'a3729df1' + ')'
  }, [_createVNode("path", {
    "d": "M21.1678 16.594C22.8156 10.9872 29.4907 8.66639 34.2614 12.0416C38.3867 14.9602 39.0791 20.8076 35.7495 24.609L32.6192 28.183C27.4 34.1417 20.8092 38.741 13.4156 41.5837L9.85755 42.9517C9.12779 43.2322 8.30608 43.1295 7.66783 42.678C6.39521 41.7776 6.34327 39.9076 7.56396 38.938L10.3431 36.7305C14.5084 33.422 17.5492 28.9067 19.0491 23.8031L21.1678 16.594Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("path", {
    "d": "M29.8417 10.6835C30.6939 8.09689 33.4817 6.69083 36.0683 7.54302C38.6549 8.3952 40.061 11.1829 39.2088 13.7696C38.8983 14.7121 38.3308 15.4978 37.6097 16.0747",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("path", {
    "d": "M42 4L38 8",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null)]), _createVNode("defs", null, [_createVNode("clipPath", {
    "id": props.id + 'a3729df1'
  }, [_createVNode("rect", {
    "width": "48",
    "height": "48",
    "fill": props.colors[2]
  }, null)])])]);
});