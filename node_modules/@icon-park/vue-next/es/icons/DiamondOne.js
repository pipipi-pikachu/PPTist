import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('diamond-one', false, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M5.93882 13.9336L23.0362 4.53011C23.6363 4.20002 24.3637 4.20002 24.9638 4.53011L42.0612 13.9336C43.0988 14.5043 43.4161 15.8467 42.7438 16.8215L25.6464 41.6127C24.8515 42.7654 23.1485 42.7654 22.3536 41.6127L5.25624 16.8215C4.58391 15.8467 4.90118 14.5044 5.93882 13.9336Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null)]);
});