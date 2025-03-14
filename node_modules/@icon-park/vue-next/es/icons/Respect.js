import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('respect', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M44 42H31L28.0444 28.2072C28.0149 28.0694 28 27.929 28 27.7881V15L20.5696 9.03598C19.7093 8.34543 19.5872 7.08156 20.2994 6.23908C20.9073 5.52003 21.9403 5.33418 22.7607 5.79624L32 11L35.9475 25.8031C35.9824 25.934 36.0305 26.0611 36.0911 26.1822L44 42Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M36 26L28 28",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M19.379 25.5209L19.4429 25.5743C20.3862 26.3631 21.8112 26.1218 22.4423 25.0665L24 22.4616V17.7692L20.32 15L13.96 15.8461L9.81453 23.9417C9.76493 24.0385 9.72331 24.1393 9.6901 24.2429L4 42H15.96V29L17 24.0872L17.5 22H19L18.6963 23.6175C18.5627 24.3288 18.8238 25.0567 19.379 25.5209Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M10 25L16 28",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});