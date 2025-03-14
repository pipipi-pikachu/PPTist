import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('eggplant', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M35 18L31.1193 30.6124C31.0398 30.8708 30.9648 31.1262 30.8719 31.3801C30.324 32.8784 27.8826 38.4193 21.0006 41C13.0007 44 4.99941 40 5 32.0769C5.00059 24.1538 13 25 17 22C21 19 25 13 25 13",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("path", {
    "d": "M39.2545 24.4878C39.2545 24.4878 40.3716 19.1756 40.001 16.0002C39.496 11.6727 37.501 8.50022 35.0002 7.00023C32.4995 5.50025 27.2531 4.50021 23.0004 7.00025C18.7477 9.50028 16.9676 12.8454 16.9676 12.8454L25.1744 12.0776C25.6536 12.0327 26.0968 12.3357 26.2291 12.7985L27.7262 18.0387C27.878 18.5697 28.4315 18.8772 28.9625 18.7255L34.2444 17.2162C34.688 17.0894 35.1607 17.2826 35.3886 17.6837L39.2545 24.4878Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M36 8L42 6",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});