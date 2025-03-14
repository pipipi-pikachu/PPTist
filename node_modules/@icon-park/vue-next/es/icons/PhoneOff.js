import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('phone-off', true, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("path", {
    "d": "M19.4438 21.5002C19.017 20.4327 18.8747 19.7008 18.8747 19.7008L21.2315 14.9871C21.5266 14.3968 21.5116 13.6989 21.1913 13.1219L18.7448 8.71511C18.3922 8.07987 17.7228 7.68585 16.9962 7.68585L11.9236 7.68585C9.33993 7.68585 7.47453 10.0881 8.30063 12.5361C9.5121 16.1261 11.5052 21.1308 14.3465 25.5002M26.6772 28.9117C27.9041 29.4334 28.7742 29.6003 28.7742 29.6003L33.4871 27.2438C34.0778 26.9485 34.7762 26.9637 35.3534 27.2846L39.7727 29.7416C40.4073 30.0945 40.8009 30.7635 40.8009 31.4896L40.8009 36.5632C40.8009 39.1468 38.3973 41.0118 35.9493 40.1856C32.2021 38.921 26.9142 36.805 22.4161 33.7619",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), _createVNode("path", {
    "d": "M40 8L8 40",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});