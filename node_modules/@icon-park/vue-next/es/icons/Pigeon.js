import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('pigeon', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M13.9995 26C12.9602 24.2074 11.8506 20.4489 16.008 15.7556C17.2206 14.6148 18.8143 13.1156 21.7244 12.3333C24.8424 10.8667 26.4014 8.52 24.3227 5C25.8817 5.97778 28.9997 9.69333 28.9997 16.7333",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M16.2527 27.9296C8 23.5714 4.51053 30.1954 4 33.7547C8 33.7547 12.679 36.6663 14.7211 39.5785C18.3969 44.238 24.0807 43.1379 26.4632 42.0053C33.8148 38.1223 36.3334 38.4459 36.6737 39.0931C37.0822 42.1995 38.2053 42.9761 38.7159 42.9761C42.3917 43.3644 43.651 38.9313 43.8211 36.6662C44.638 27.3471 42.4597 26.9588 41.2685 27.9296C36.3674 33.7541 33.4404 34.8866 32.5895 34.7247C28.9137 33.9481 29.3562 32.4597 30.0369 31.8125C36.5716 26.3763 36.5036 14.3391 35.6527 9C33.2022 14.8245 29.186 17.2513 27.4843 17.7367C17.2737 20.4548 15.7421 25.6645 16.2527 27.9296Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("circle", {
    "cx": "12",
    "cy": "31.4121",
    "r": "2",
    "fill": props.colors[2]
  }, null)]);
});