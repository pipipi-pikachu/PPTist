import { createVNode as _createVNode } from "vue";
import { inject, provide } from 'vue';
export var DEFAULT_ICON_CONFIGS = {
  size: '1em',
  strokeWidth: 4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  rtl: false,
  theme: 'outline',
  colors: {
    outline: {
      fill: '#333',
      background: 'transparent'
    },
    filled: {
      fill: '#333',
      background: '#FFF'
    },
    twoTone: {
      fill: '#333',
      twoTone: '#2F88FF'
    },
    multiColor: {
      outStrokeColor: '#333',
      outFillColor: '#2F88FF',
      innerStrokeColor: '#FFF',
      innerFillColor: '#43CCF8'
    }
  },
  prefix: 'i'
};

function guid() {
  return 'icon-' + ((1 + Math.random()) * 0x100000000 | 0).toString(16).substring(1);
}

export function IconConverter(id, icon, config) {
  var fill = typeof icon.fill === 'string' ? [icon.fill] : icon.fill || [];
  var colors = [];
  var theme = icon.theme || config.theme;

  switch (theme) {
    case 'outline':
      colors.push(typeof fill[0] === 'string' ? fill[0] : 'currentColor');
      colors.push('none');
      colors.push(typeof fill[0] === 'string' ? fill[0] : 'currentColor');
      colors.push('none');
      break;

    case 'filled':
      colors.push(typeof fill[0] === 'string' ? fill[0] : 'currentColor');
      colors.push(typeof fill[0] === 'string' ? fill[0] : 'currentColor');
      colors.push('#FFF');
      colors.push('#FFF');
      break;

    case 'two-tone':
      colors.push(typeof fill[0] === 'string' ? fill[0] : 'currentColor');
      colors.push(typeof fill[1] === 'string' ? fill[1] : config.colors.twoTone.twoTone);
      colors.push(typeof fill[0] === 'string' ? fill[0] : 'currentColor');
      colors.push(typeof fill[1] === 'string' ? fill[1] : config.colors.twoTone.twoTone);
      break;

    case 'multi-color':
      colors.push(typeof fill[0] === 'string' ? fill[0] : 'currentColor');
      colors.push(typeof fill[1] === 'string' ? fill[1] : config.colors.multiColor.outFillColor);
      colors.push(typeof fill[2] === 'string' ? fill[2] : config.colors.multiColor.innerStrokeColor);
      colors.push(typeof fill[3] === 'string' ? fill[3] : config.colors.multiColor.innerFillColor);
      break;
  }

  return {
    size: icon.size || config.size,
    strokeWidth: icon.strokeWidth || config.strokeWidth,
    strokeLinecap: icon.strokeLinecap || config.strokeLinecap,
    strokeLinejoin: icon.strokeLinejoin || config.strokeLinejoin,
    colors: colors,
    id: id
  };
}
var IconContext = Symbol('icon-context');
export var IconProvider = function IconProvider(config) {
  provide(IconContext, config);
};
export function IconWrapper(name, rtl, render) {
  var options = {
    name: 'icon-' + name,
    props: ['size', 'strokeWidth', 'strokeLinecap', 'strokeLinejoin', 'theme', 'fill', 'spin'],
    setup: function setup(props) {
      var id = guid();
      var ICON_CONFIGS = inject(IconContext, DEFAULT_ICON_CONFIGS);
      return function () {
        var size = props.size,
            strokeWidth = props.strokeWidth,
            strokeLinecap = props.strokeLinecap,
            strokeLinejoin = props.strokeLinejoin,
            theme = props.theme,
            fill = props.fill,
            spin = props.spin;
        var svgProps = IconConverter(id, {
          size: size,
          strokeWidth: strokeWidth,
          strokeLinecap: strokeLinecap,
          strokeLinejoin: strokeLinejoin,
          theme: theme,
          fill: fill
        }, ICON_CONFIGS);
        var cls = [ICON_CONFIGS.prefix + '-icon'];
        cls.push(ICON_CONFIGS.prefix + '-icon' + '-' + name);

        if (rtl && ICON_CONFIGS.rtl) {
          cls.push(ICON_CONFIGS.prefix + '-icon-rtl');
        }

        if (spin) {
          cls.push(ICON_CONFIGS.prefix + '-icon-spin');
        }

        return _createVNode("span", {
          "class": cls.join(' ')
        }, [render(svgProps)]);
      };
    }
  };
  return options;
}