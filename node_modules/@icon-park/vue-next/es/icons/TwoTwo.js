import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('two-two', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M26.7446 44H25.8495C20.6392 44 15.7797 41.3742 12.9243 37.016L10.7288 33.6651C9.17072 31.2869 9.63077 28.1201 11.8012 26.2836L14.0887 24.3481C14.3496 24.1273 14.5 23.8029 14.5 23.4611V7.25C14.5 5.45507 15.9551 4 17.75 4C19.5449 4 21 5.45508 21 7.25V6.25C21 4.45507 22.4551 3 24.25 3C26.0449 3 27.5 4.45508 27.5 6.25V17.75C27.5 15.9551 28.9551 14.5 30.75 14.5C32.5449 14.5 34 15.9551 34 17.75V21.75C34 19.9551 35.4551 18.5 37.25 18.5C39.0449 18.5 40.5 19.9551 40.5 21.75V31.9688C40.5 33.6177 40.0018 35.2282 39.0707 36.589L38.097 38.012C35.5331 41.7593 31.2851 44 26.7446 44Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});