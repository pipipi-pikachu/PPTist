import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('pie-seven', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("circle", {
    "cx": "24",
    "cy": "24",
    "r": "20",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M24 4C28.6001 4 33.0597 5.58577 36.6271 8.49009C40.1944 11.3944 42.6516 15.4397 43.5845 19.9443C44.5173 24.4488 43.8688 29.1373 41.7483 33.2195C39.6277 37.3017 36.1648 40.5282 31.943 42.3551C27.7212 44.182 22.9986 44.4978 18.5712 43.2491C14.1438 42.0004 10.2821 39.2637 7.637 35.5001C4.9919 31.7365 3.72505 27.1761 4.04994 22.5875C4.37484 17.9988 6.27162 13.6624 9.42063 10.3091L24 24V4Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});