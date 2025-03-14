import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('vacation', false, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M11 14.999L5 15.999C6.62916 8.48478 11.3642 6.00624 16 5.99904C18.9968 5.99438 21.9521 7.0251 24 7.99963C26.0479 7.0251 29 5.99988 32 5.99962C36.6113 5.99922 41.3708 8.48478 43 15.999L37 14.999C37.5588 17.0992 38.7882 20.7915 37 23.999C34.0196 21.3261 27.1294 17.2902 24 14.9991C20.8706 17.2902 13.9804 21.3261 11 23.999C9.21176 20.7915 10.4412 17.0992 11 14.999Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M24 15C23.2454 18.8889 22.1889 28.5333 24 36",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M12 41.9992H36C31.2134 37.4146 29 36.0048 24 36C19 35.9952 13.892 39.3817 12 41.9992Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});