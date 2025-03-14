import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('topbuzz', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M18.9054 18.168L10.3257 16.3443C9.76801 16.2257 9.41204 15.6776 9.53057 15.12L11.4621 6.03265C11.5807 5.47501 12.1288 5.11904 12.6865 5.23757L41.9678 11.4615C42.5254 11.58 42.8814 12.1282 42.7629 12.6858L40.8313 21.7731C40.7128 22.3308 40.1646 22.6867 39.607 22.5682L31.1006 20.7601C30.7133 20.6778 30.4837 20.806 30.4117 21.1448C29.5295 25.295 28.2063 31.5204 26.4419 39.821C26.3234 40.3786 25.7752 40.7346 25.2176 40.616L16.1303 38.6845C15.5727 38.5659 15.2167 38.0178 15.3352 37.4602C17.1 29.1573 18.4236 22.9302 19.3061 18.7788C19.3773 18.4435 19.2438 18.2399 18.9054 18.168Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});