import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('basketball-clothes', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M30 4C30 7.31371 27.3137 10 24 10C20.6863 10 18 7.31371 18 4H15C13.8954 4 12.9976 4.89414 12.9681 5.99832C12.8995 8.57035 12.6829 12.9512 12 15C11.2389 17.2832 8.16103 20.1456 6.73361 21.3831C6.27454 21.7811 6 22.3537 6 22.9613V42C6 43.1046 6.89543 44 8 44H40C41.1046 44 42 43.1046 42 42V22.9613C42 22.3537 41.7255 21.7811 41.2664 21.3831C39.839 20.1456 36.7611 17.2832 36 15C35.3171 12.9512 35.1005 8.57035 35.0319 5.99832C35.0024 4.89414 34.1046 4 33 4H30Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("rect", {
    "x": "27",
    "y": "24",
    "width": "6",
    "height": "12",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M15 24H21V36H15",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M21 30H15",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});