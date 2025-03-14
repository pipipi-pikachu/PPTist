"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IconPark = void 0;
exports.install = install;

var _vue = require("vue");

var IconMap = _interopRequireWildcard(require("./map"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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
      return (0, _vue.createVNode)(IconMap[type], {
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
var IconPark = IconParkOptions;
exports.IconPark = IconPark;

function install(Vue, prefix) {
  Object.values(IconMap).forEach(function (icon) {
    Vue.component(prefix ? prefix + '-' + icon.name.slice(5) : icon.name, icon);
  });
}