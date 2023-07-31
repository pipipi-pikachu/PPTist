## Project directory and data structure

### Project directory structure
```
├── assets // static resources
│ ├── fonts // online font files
│ └── styles // styles
│ ├── antd.scss // antd default style override
│ ├── font.scss // online font definition
│ ├── global.scss // general global style
│ ├── mixin.scss // scss global mixin
│ ├── variable.scss // scss global variable
│ └── prosemirror.scss // ProseMirror rich text default style
├── components // Common components that have nothing to do with business logic
├── configs // Configuration files, such as: canvas size, font, animation configuration, shortcut key configuration, preset shape, preset line and other data.
├── hooks // hooks method used by multiple components (modules)
├── mocks // mocks data
├── plugins // custom Vue plugins
├── types // type definition file
├── store // Pinia store, reference: https://pinia.vuejs.org/
├── utils // general utility methods
└── views // Business component directory, divided into `editor` and `player` two parts.
     ├── components // common business components
     ├── Editor // editor module
     ├── Screen // player module
     └── Mobile // Mobile module
```


### data
The slide data mainly consists of two parts `slides` and `theme`.
> In other words, in the actual production environment, generally only these two items of data need to be stored.

- `slides` represents the slide page data, including the ID, element content, notes, background, animation, page cutting method and other information of each page
- `theme` represents the theme data of the slideshow, including background color, theme color, font color, font and other information

The definition of specific types can be seen: [https://github.com/supernovate07/super-ppt/blob/master/src/types/slides.ts](https://github.com/supernovate07/super-ppt/blob/ master/src/types/slides.ts)