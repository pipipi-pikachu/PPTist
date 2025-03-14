import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('weixin-scan', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M37 30H12L14 35H26L28.0883 41.2649C28.6328 42.8983 30.1613 44 31.883 44H38C40.2091 44 42 42.2091 42 40V30L43 23L39.3536 23.7293C38.5388 23.8922 37.9097 24.542 37.7731 25.3616L37 30Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M11 18H36L34 13H22L19.9117 6.73509C19.3672 5.10172 17.8387 4 16.117 4H10C7.79086 4 6 5.79086 6 8V18L5 25L8.64639 24.2707C9.46118 24.1078 10.0903 23.458 10.2269 22.6384L11 18Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});