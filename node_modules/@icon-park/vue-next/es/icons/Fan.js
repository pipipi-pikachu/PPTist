import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('fan', false, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M23.9995 31V36M14.0134 27.7553L4.02734 24.5106C5.39776 20.2929 8.06824 16.6173 11.656 14.0106C15.2438 11.404 19.5648 10 23.9995 10C28.4343 10 32.7552 11.404 36.343 14.0106C39.9308 16.6173 42.6013 20.2929 43.9717 24.5106L33.9856 27.7553H14.0134ZM14.0134 27.7553C14.6986 25.6465 16.0339 23.8087 17.8278 22.5053L14.0134 27.7553ZM14.0134 27.7553L23.9995 31L14.0134 27.7553ZM17.8278 22.5053C19.6217 21.202 21.7821 20.5 23.9995 20.5L17.8278 22.5053ZM17.8278 22.5053L23.9995 31L17.8278 22.5053ZM23.9995 20.5C26.2169 20.5 28.3774 21.202 30.1713 22.5053L23.9995 20.5ZM23.9995 20.5V31V20.5ZM30.1713 22.5053C31.9652 23.8087 33.3004 25.6465 33.9856 27.7553L30.1713 22.5053ZM30.1713 22.5053L23.9995 31L30.1713 22.5053ZM33.9856 27.7553L23.9995 31L33.9856 27.7553Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});