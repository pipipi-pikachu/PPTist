import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('weixin-top-stories', false, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M24.0002 4L31.2002 11.5292L41.3207 14L38.4002 24L41.3207 34L31.2002 36.4708L24.0002 44L16.8002 36.4708L6.67969 34L9.6002 24L6.67969 14L16.8002 11.5292L24.0002 4Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M30.9772 11.915L31.3718 19.7439L37.9544 24L31.3718 28.2561L30.9772 36.0849L23.9999 32.5122L17.0227 36.0849L16.6281 28.2561L10.0454 24L16.6281 19.7439L17.0227 11.915L23.9999 15.4877L30.9772 11.915Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});