# IconPark Icons
> Vue3 Icons for IconPark

## Introduction

### Features
* Provide more than 2000 icons
* Provide 4 themes:
    * outline
    * filled
    * two-tone
    * multi-color

### More
Please visit [IconPark Website](http://iconpark.bytedance.com)
* Copy SVG
* Copy React Icon component
* Copy Vue Icon component
* Download PNG
* Download SVG

## Getting Started
### Install

```
npm install @icon-park/vue-next --save
```

### Include Component
Import an icon from `@icon-park/vue-next`at the top of a component and then use it in the template tag:

``` vue
<template>
<home theme="filled"/>
</template>
<script>
import {Home} from '@icon-park/vue-next';

export default {
    components: {
        Home
    }
}
</script>
```
If you don't want to refer to it, you can install icons globally.

```typescript
import {install} from '@icon-park/vue-next/es/all';
import {createApp} from 'vue';

const app = createApp({});

// Install
install(app); // use default prefix 'icon', eg: icon is People, name is icon-people.
install(app, 'i'); // use custom prefix 'i', eg: icon is People, name is i-people.

app.mount('#app');
```
### Style Sheet

Import the icon style:

```typescript
import '@icon-park/vue-next/styles/index.css';
```

### Global Config
You can use `IconProvider` in `@icon-park/vue-next` to set the default config globally:

```html
<template>
<div>
<home/>
</div>
</template>
<script lang="ts">
import {DEFAULT_ICON_CONFIGS, IconProvider} from '@icon-park/vue-next';
import {Home} from '@icon-park/vue-next';

export default {
    name: 'App',
    setup(){
        IconProvider({...DEFAULT_ICON_CONFIGS, prefix: 'icon'});
    },
    components: {
        Home
    }
};
</script>

```

### Import on Demand

You can use [babel-plugin-import](https://github.com/ant-design/babel-plugin-import) to import icons on demand.

Set config like this:
```json
{
    "plugins": [
        [
            "import",
            {
                "libraryName": "@icon-park/vue-next",
                "libraryDirectory": "es/icons",
                "camel2DashComponentName": false 
            }
        ]
    ]
}
```

### Icon Component
We recommend loading icons on demand, because this can greatly reduce the volume of compiled code。
However, in some scenarios similar to remote loading menus, direct reference to all icons can reduce the development cost.

Usage:


``` vue
<template>
<icon-park type="AddText" theme="filled"/>
<icon-park type="add-text" theme="filled"/>
</template>
<script>
import {IconPark} from '@icon-park/vue-next/es/all';

export default {
    components: {
        IconPark
    }
}
</script>
```
    
### Embed IconPark in your project 
If you need to use additional information such as icon name, author, category, label and creation time, you can use the `icons.json` file located in the root directory of each NPM.


## Props
|    prop	 | description  | type  | default | note |
| ---------- | --- | --- | --- | --- |
| theme |  Theme of the icons.  | 'outline' &#124; 'filled' &#124; 'two-tone' &#124; 'multi-color' | 'outline'  |
| size |  The width/height of the icon | number &#124; string |  '1em' |
| spin |  Rotate icon with animation | boolean | false |
| fill |  Colors of theme | string  &#124; string[] |  'currentColor' |
| strokeLinecap |  the stroke-linecap prop of svg element | 'butt' &#124; 'round' &#124; 'square' |  'round' |
| strokeLinejoin |  the stroke-linejoin prop of svg element | 'miter' &#124; 'round' &#124; 'bevel' |  'round' |
| strokeWidth |  the stroke-width prop of svg element | number |  4 |

