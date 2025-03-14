import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('nutrition', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    "d": "M24 42C24.8653 42 26.8503 42 29.9551 42C30.0381 39.2631 30.4393 37.7582 31.1586 37.4852C38.6685 34.6357 44 27.434 44 19H4C4 27.2514 9.10319 34.3234 16.3568 37.2941C17.1151 37.6047 17.6815 39.1733 18.056 42C21.0857 42 23.067 42 24 42Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M14.4434 26.0225C14.803 27.2103 15.2786 28.191 15.8702 28.9646C16.4484 29.7209 17.1619 30.4223 18.0104 31.0688",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null), _createVNode("path", {
    "d": "M32.2009 8.01759C30.9409 7.31418 29.5829 6.76784 28.1528 6.40474M22.0507 6C14.9273 6.8226 9.1442 12.0978 7.5 19M40.5 18.9965C39.8296 16.1847 38.4722 13.643 36.6172 11.5626",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null)]);
});