"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  IconProvider: true,
  DEFAULT_ICON_CONFIGS: true
};
Object.defineProperty(exports, "DEFAULT_ICON_CONFIGS", {
  enumerable: true,
  get: function () {
    return _runtime.DEFAULT_ICON_CONFIGS;
  }
});
Object.defineProperty(exports, "IconProvider", {
  enumerable: true,
  get: function () {
    return _runtime.IconProvider;
  }
});

var _map = require("./map");

Object.keys(_map).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _map[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _map[key];
    }
  });
});

var _runtime = require("./runtime");