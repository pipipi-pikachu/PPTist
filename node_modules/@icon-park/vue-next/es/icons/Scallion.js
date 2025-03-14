import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('scallion', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("g", {
    "clip-path": 'url(#' + props.id + '5ece35de' + ')'
  }, [_createVNode("path", {
    "d": "M20.0001 23.9999C20.0001 23.9999 22.4996 19.4999 22.9996 14.9999C23.4996 10.4999 21.9997 6.99993 21.9997 6.99993L27 3.99992C27 3.99992 27.9992 9.99993 27.9992 12.9999",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M5.99994 42.9999C3.9995 41.4999 4.00123 36.0894 8.00047 32.9999C11.9997 29.9104 12.1858 30.7172 17 26.9999C21.8142 23.2826 34 3.99991 34 3.99991L38.5001 7.49992L26.3104 23.7401C23.3258 27.7165 22.5516 33.0528 20.0508 37.3501C18.1011 40.7002 15.9999 41.9999 13.9999 42.9999C11.9999 43.9999 8.00037 44.4999 5.99994 42.9999Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M23.0001 30C23.0001 30 25.9999 28 29.9998 26C33.9998 24 43 24 43 24L40 17C40 17 31.9996 17 29.0001 20",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]), _createVNode("defs", null, [_createVNode("clipPath", {
    "id": props.id + '5ece35de'
  }, [_createVNode("rect", {
    "width": "48",
    "height": "48",
    "fill": props.colors[2]
  }, null)])])]);
});