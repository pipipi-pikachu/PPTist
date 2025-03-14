import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('two-fingers', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M12.5658 27.1824C10.8553 28.3542 10 30.2935 10 33.0002C10 37.0603 14.9753 44.0002 19.4618 44.0002C23.9483 44.0002 26.5502 44.0002 30.9415 44.0002C35.3328 44.0002 38 40.1496 38 37.0603C38 32.7099 38 28.3596 38 24.0093C38 22.3524 36.6569 21.0093 35 21.0093H34.9909C33.3391 21.0093 32 22.3484 32 24.0002",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null), _createVNode("path", {
    "d": "M13.981 29.4452V11.0059C13.981 9.35036 15.323 8.0083 16.9785 8.0083C16.9813 8.0083 16.9841 8.0083 16.9868 8.00831C18.6482 8.01291 19.9927 9.36106 19.9927 11.0225V24.592",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null), _createVNode("path", {
    "d": "M19.9927 24.0083V7.01549C19.9927 5.35008 21.3428 4 23.0082 4C24.6736 4 26.0236 5.35008 26.0236 7.01549V24.0083",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M26 23.7158V21.0034C26 19.3466 27.3431 18.0034 29 18.0034C30.6569 18.0034 32 19.3466 32 21.0034V24.0034",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});