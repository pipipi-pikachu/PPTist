import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('pig', false, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M14.0538 9.64415C14.5962 10.1855 15.0733 10.8148 15.4678 11.4894C17.927 9.95189 20.8351 9.06302 23.9511 9.06302C27.0975 9.06302 30.0317 9.96926 32.5061 11.5345C32.9055 10.8428 33.3917 10.1975 33.9462 9.64418C36.4673 7.12825 40.8924 6.02041 42.937 8.06083C44.9816 10.1012 43.8715 14.5172 41.3504 17.0332C40.6016 17.7805 39.6848 18.4035 38.7122 18.8568C39.511 20.7563 39.9524 22.8424 39.9524 25.0315C39.9524 33.8507 32.7884 41 23.9511 41C15.1138 41 7.94978 33.8507 7.94978 25.0315C7.94978 22.8277 8.39715 20.7281 9.20621 18.8183C8.26404 18.3685 7.37746 17.7595 6.64959 17.0331C4.12849 14.5172 3.01837 10.1012 5.06298 8.06079C7.10758 6.02038 11.5327 7.12822 14.0538 9.64415Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("ellipse", {
    "cx": "24",
    "cy": "29",
    "rx": "8",
    "ry": "7",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("circle", {
    "cx": "17",
    "cy": "18",
    "r": "2",
    "fill": props.colors[0]
  }, null), _createVNode("circle", {
    "cx": "21",
    "cy": "29",
    "r": "2",
    "fill": props.colors[2]
  }, null), _createVNode("circle", {
    "cx": "31",
    "cy": "18",
    "r": "2",
    "fill": props.colors[0]
  }, null), _createVNode("circle", {
    "cx": "27",
    "cy": "29",
    "r": "2",
    "fill": props.colors[2]
  }, null)]);
});