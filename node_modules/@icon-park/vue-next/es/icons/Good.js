import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('good', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M8.00635 19.1973C12.4427 10.3246 21.9995 7.00009 28.5063 4.19696C31.4639 2.92285 32.1955 7.7231 31.0063 10.6967C30.0063 13.1973 28.0063 16.0001 28.0063 16.0001H36.5063C38.4393 16.0001 40.0063 17.5671 40.0063 19.5001C40.0063 21.4331 38.4393 23.0001 36.5063 23.0001H38.5063C40.4393 23.0001 42.0063 24.5671 42.0063 26.5001C42.0063 28.4331 40.4393 30.0001 38.5063 30.0001H34.5063C36.4393 30.0001 38.0063 31.5671 38.0063 33.5001C38.0063 35.4331 36.4393 37.0001 34.5063 37.0001H31.5063C33.4393 37.0001 35.0063 38.5671 35.0063 40.5001C35.0063 42.4331 33.4408 44.0001 31.5078 44.0001H19.0063C15.5063 44.0001 11.0063 42.1973 8.00635 37.197C5.13054 32.4036 5.00635 25.1973 8.00635 19.1973Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});