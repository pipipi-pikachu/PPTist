import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('phone-video-call', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M14.3756 9.7941C15.1022 9.7941 15.7716 10.1881 16.1242 10.8234L18.5706 15.2302C18.891 15.8072 18.906 16.5051 18.6109 17.0954L16.254 21.809C16.254 21.809 16.937 25.3204 19.7955 28.1789C22.6539 31.0373 26.1535 31.7085 26.1535 31.7085L30.8665 29.3521C31.4572 29.0567 32.1555 29.072 32.7327 29.3929L37.1521 31.8499C37.7867 32.2027 38.1802 32.8718 38.1802 33.5979L38.1802 38.6714C38.1802 41.2551 35.7803 43.1211 33.3323 42.2951C28.3043 40.5986 20.4997 37.3684 15.5528 32.4215C10.606 27.4747 7.37576 19.67 5.67922 14.6421C4.8532 12.194 6.71929 9.7941 9.30293 9.7941L14.3756 9.7941Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M39 15H27V5H39V8L44 6V14L39 12V15Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});