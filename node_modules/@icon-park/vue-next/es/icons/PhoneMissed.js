import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('phone-missed', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M15.9961 8.68583C16.7227 8.68583 17.3921 9.07985 17.7448 9.71509L20.1912 14.1219C20.5115 14.6989 20.5266 15.3968 20.2314 15.9871L17.8746 20.7008C17.8746 20.7008 18.5576 24.2122 21.416 27.0706C24.2744 29.929 27.7741 30.6002 27.7741 30.6002L32.487 28.2438C33.0777 27.9484 33.7761 27.9637 34.3533 28.2846L38.7726 30.7416C39.4072 31.0945 39.8008 31.7635 39.8008 32.4896L39.8008 37.5631C39.8008 40.1468 37.4009 42.0129 34.9528 41.1868C29.9249 39.4903 22.1202 36.2601 17.1734 31.3132C12.2265 26.3664 8.99631 18.5617 7.29977 13.5338C6.47375 11.0857 8.33984 8.68583 10.9235 8.68583L15.9961 8.68583Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("rect", {
    "opacity": "0.01",
    "x": "28",
    "y": "7",
    "width": "13",
    "height": "13",
    "fill": props.colors[2]
  }, null), _createVNode("path", {
    "d": "M39 9L30 18",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M30 9L39 18",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});