import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('phone-telephone', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M16.9961 7.68583C17.7227 7.68583 18.3921 8.07985 18.7448 8.71509L21.1912 13.1219C21.5115 13.6989 21.5266 14.3968 21.2314 14.9871L18.8746 19.7008C18.8746 19.7008 19.5576 23.2122 22.416 26.0706C25.2744 28.929 28.7741 29.6002 28.7741 29.6002L33.487 27.2438C34.0777 26.9484 34.7761 26.9637 35.3533 27.2846L39.7726 29.7416C40.4072 30.0945 40.8008 30.7635 40.8008 31.4896L40.8008 36.5631C40.8008 39.1468 38.4009 41.0129 35.9528 40.1868C30.9249 38.4903 23.1202 35.2601 18.1734 30.3132C13.2265 25.3664 9.99631 17.5617 8.29977 12.5338C7.47375 10.0857 9.33984 7.68583 11.9235 7.68583L16.9961 7.68583Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});