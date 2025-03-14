import { createVNode } from 'vue';
import * as IconMap from './map';

function toPascalCase(val) {
  return val.replace(/(^\w|-\w)/g, function (c) {
    return c.slice(-1).toUpperCase();
  });
}

var IconParkOptions = {
  name: 'icon-park',
  props: ['size', 'strokeWidth', 'strokeLinecap', 'strokeLinejoin', 'theme', 'fill', 'spin', 'type'],
  setup: function setup(props) {
    var type = toPascalCase(props.type);
    var theme = props.theme,
        size = props.size,
        fill = props.fill,
        strokeLinecap = props.strokeLinecap,
        strokeLinejoin = props.strokeLinejoin,
        strokeWidth = props.strokeWidth,
        spin = props.spin;

    if (!(type in IconMap)) {
      throw new Error("".concat(type, " is not a valid icon type name"));
    }

    return function () {
      return createVNode(IconMap[type], {
        theme: theme,
        size: size,
        fill: fill,
        strokeLinecap: strokeLinecap,
        strokeLinejoin: strokeLinejoin,
        strokeWidth: strokeWidth,
        spin: spin
      });
    };
  }
};
export var IconPark = IconParkOptions;
export function install(Vue, prefix) {
  Object.values(IconMap).forEach(function (icon) {
    Vue.component(prefix ? prefix + '-' + icon.name.slice(5) : icon.name, icon);
  });
}