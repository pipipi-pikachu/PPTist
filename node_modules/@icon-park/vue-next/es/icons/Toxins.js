import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('toxins', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    "d": "M33.9579 44.0002C33.9579 44.0002 33.9824 40.5294 33.9579 39.7603C34.5074 39.4659 35.0408 39.1454 35.5563 38.8002C36.5925 38.1066 37.5566 37.3137 38.435 36.4353C41.8734 32.9969 44 28.2469 44 23.0002C44 12.5068 35.4934 4.00024 25 4.00024C14.5066 4.00024 6 12.5068 6 23.0002C6 28.2469 8.12665 32.9969 11.565 36.4353C12.4434 37.3137 13.4075 38.1066 14.4437 38.8002C14.9592 39.1454 15.4547 39.4659 16.0043 39.7603C16.0043 40.0084 16.0043 41.4218 16.0043 44.0002C27.9733 44.0002 33.9579 44.0002 33.9579 44.0002Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M18 27.0002C20.2091 27.0002 22 25.2094 22 23.0002L18 19.0002C15.7909 19.0002 14 20.7911 14 23.0002C14 25.2094 15.7909 27.0002 18 27.0002Z",
    "fill": props.colors[3],
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M32 27.0002C29.7909 27.0002 28 25.2094 28 23.0002L32 19.0002C34.2091 19.0002 36 20.7911 36 23.0002C36 25.2094 34.2091 27.0002 32 27.0002Z",
    "fill": props.colors[3],
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M22 34.0002L24.9379 31.0002L28 33.8965",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});