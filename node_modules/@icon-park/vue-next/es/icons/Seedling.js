import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('seedling', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M24 42V26",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M41.9417 10.0068C41.1662 23.0313 32.8114 27.2431 25.9958 27.9029C24.8963 28.0093 24 27.1041 24 25.9995V17.6276C24 17.3953 24.0408 17.1604 24.1245 16.9438C27.1175 9.19883 34.283 8.15499 40.0013 8.01953C41.1056 7.99337 42.0073 8.90411 41.9417 10.0068Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M7.99844 6.07206C17.3266 6.75658 22.1952 12.1631 23.834 15.6298C23.9486 15.8722 24.0001 16.1382 24.0001 16.4063V23.9101C24.0001 25.0491 23.0393 25.9645 21.9059 25.8504C7.33707 24.3838 6.11103 14.7864 6.00913 7.9987C5.99255 6.89426 6.89684 5.99122 7.99844 6.07206Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});