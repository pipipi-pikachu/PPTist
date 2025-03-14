import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('pacifier', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("g", {
    "clip-path": 'url(#' + props.id + '02a82aa8' + ')'
  }, [_createVNode("path", {
    "d": "M30.6561 21.5855L34.7593 17.4823C36.761 18.0169 38.9853 17.499 40.5556 15.9286C42.8988 13.5855 42.8988 9.78647 40.5556 7.44332C38.2125 5.10018 34.4135 5.10018 32.0703 7.44332C30.5 9.0137 29.9821 11.238 30.5166 13.2397L26.4135 17.3428",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M41.263 32.1922L15.8071 6.73633L11.918 10.6254L19.6962 21.9391L16.8678 26.1818L21.464 30.778L25.7066 27.9495L37.3739 36.0813L41.263 32.1922Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M19.3197 21.8847C15.9285 20.8969 12.117 21.74 9.44302 24.4139C5.53778 28.3192 5.53778 34.6508 9.44302 38.556C13.3483 42.4613 19.6799 42.4613 23.5852 38.556C26.2591 35.8821 27.1022 32.0706 26.1144 28.6793",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]), _createVNode("defs", null, [_createVNode("clipPath", {
    "id": props.id + '02a82aa8'
  }, [_createVNode("rect", {
    "width": "48",
    "height": "48",
    "fill": props.colors[2]
  }, null)])])]);
});