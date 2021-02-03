# PPTist
> 一个基于 Vue3.x + TypeScript 的在线演示文稿应用，还原了大部分PPT常用功能，支持 文字、图片、形状、线条、图表、表格 6种最常用的元素类型，每一种元素都拥有高度可编辑能力，同时支持丰富的快捷键和右键菜单，尽可能还原本地桌面应用的使用体验。

你可以对它进行二次开发，打造属于自己的 在线演示文稿应用 或者 在线设计工具（二次开发文档正在编写中）。

在线体验地址：https://pptist.gitee.io/

Github仓库（优先更新）：https://github.com/pipipi-pikachu/PPTist


# 项目运行
```
npm install

npm run serve
```

# 常见问题
Q. 为什么xxx快捷键没有作用？

A. 部分快捷键需要聚焦到指定区域才会生效，例如焦点在左边缩略图列表才能使用操作页面的快捷键，焦点在画布区域才能使用操作元素的快捷键。

Q. 为什么粘贴没有作用？

A. 请注意允许浏览器访问系统剪贴板。

Q. 为什么浏览器刷新或重新打开后，之前做的PPT没有了？

A. 该演示项目是纯前端部署的，不会保存数据。

Q. 如何调整幻灯片页面的顺序？

A. 按住左侧缩略图可进行拖拽调整顺序。

# 项目依赖

`ant-design-vue` -- UI库

`lodash` -- 工具库

`prosemirror` -- 富文本编辑框架，用于文本元素的富文本编辑

`chartist` -- svg图表库，用于图表元素

`tinycolor2` -- 颜色处理工具

`dexie` -- indexedDB 包装器，用于记录历史操作

`store2` -- localstorage 和 sessionstorage 包装器

`mitt` -- 自定义事件发射/监听

`animate.css` -- CSS动画库

`vuedraggable` -- 基于vue的拖拽插件，用于调整页面顺序等

`crypto-js` -- 加密函数库，用于加解密剪贴板内容

`clipboard` -- 用于复制内容到剪贴板

`@icon-park/vue-next` -- 图标库

# License
MIT