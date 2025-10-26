<p align="center">
    <img src='/public/logo.png' />
</p>

<p align="center">
    <a href="https://www.github.com/pipipi-pikachu/PPTist/stargazers" target="_black"><img src="https://img.shields.io/github/stars/pipipi-pikachu/PPTist?logo=github" alt="stars" /></a>
    <a href="https://www.github.com/pipipi-pikachu/PPTist/network/members" target="_black"><img src="https://img.shields.io/github/forks/pipipi-pikachu/PPTist?logo=github" alt="forks" /></a>
    <a href="https://www.github.com/pipipi-pikachu/PPTist/blob/master/LICENSE" target="_black"><img src="https://img.shields.io/github/license/pipipi-pikachu/PPTist?color=%232DCE89&logo=github" alt="license" /></a>
    <a href="https://www.typescriptlang.org" target="_black"><img src="https://img.shields.io/badge/language-TypeScript-blue.svg" alt="language"></a>
    <a href="https://github.com/pipipi-pikachu/PPTist/issues" target="_black"><img src="https://img.shields.io/github/issues-closed/pipipi-pikachu/PPTist.svg" alt="issue"></a>
    <a href="https://gitee.com/pptist/PPTist" target="_black"><img src="https://gitee.com/pptist/PPTist/badge/star.svg?version=latest" alt="gitee"></a>
</p>

[简体中文](README_zh.md) | English


# 🎨 PPTist
> PowerPoint-ist（/'pauəpɔintist/）, A web-based presentation (slideshow) application. This application replicates most of the commonly used features of Microsoft Office PowerPoint. It supports various essential element types such as text, images, shapes, lines, charts, tables, videos, audio, and formulas. You can edit and present slides directly in a web browser.

<b>Try it online👉：[https://pipipi-pikachu.github.io/PPTist/](https://pipipi-pikachu.github.io/PPTist/)</b>

# ✨ Highlights
1. <b>Easy Development</b>: Built with Vue 3.x and TypeScript, it does not rely on UI component libraries and avoids third-party components as much as possible. This makes styling customization easier and functionality extension more convenient.
2. <b>User Friendly</b>: It offers a context menu available everywhere, dozens of keyboard shortcuts, and countless editing detail optimizations, striving to replicate a desktop application-level experience.
3. <b>Feature Rich</b>: Supports most of the commonly used elements and functionalities found in PowerPoint, supports generate PPT by AI, supports exporting in various formats, and offers basic editing and previewing on mobile devices.

# 👀 Front-Row Reminder
1. This project is a "Web Slideshow Application", not a "low-code platform", "H5 editor", "image editor", "whiteboard application", or similar tools.
2. The target audience for this project is <b>developers with needs for [Web slideshow] development, basic web development experience is required</b>. The provided link is merely a demo address and does not offer any online services. You should not use this project directly as a tool, nor does it support out-of-the-box functionality. If you simply need a service or tool, you can opt for more excellent and mature products such as: [Slidev](https://sli.dev/)、[revealjs](https://revealjs.com/), etc.
3. Here are some summarized [Frequently Asked Questions](/doc/Q&A.md). When raising Issues or submitting PRs for the first time, be sure to read this document in advance.
4. For commercial use, please refer to [商业用途](#-商业用途)


# 🚀 Installation
```
npm install

npm run dev
```
Browser access: http://127.0.0.1:5173/


# 📚 Features
### Basic Features
- History (undo, redo)
- Shortcuts
- Right-click menu
- Export local files (PPTX, JSON, images, PDF)
- Import and export pptist files
- Print
- AI PPT
### Slide Page Editing
- Add/delete pages
- Copy/paste pages
- Adjust page order
- Create sections
- Background settings (solid color, gradient, image)
- Set canvas size
- Gridlines
- Rulers
- Canvas zoom and move
- Theme settings
- Extract slides style
- Speaker notes (rich text)
- Slide templates
- Transition animations
- Element animations (entrance, exit, emphasis)
- Selection panel (hide elements, layer sorting, element naming)
- Labels for Page and Node Types (usable for template-related features)
- Find/replace
- Annotations
### Slide Element Editing
- Add/delete elements
- Copy/paste elements
- Drag and move elements
- Rotate elements
- Scale elements
- Multiple element selection (marquee, point selection)
- Group multiple elements
- Batch edit multiple elements
- Lock elements
- Magnetic alignment of elements (move and scale)
- Adjust element layer
- Align elements to canvas
- Align elements to other elements
- Evenly distribute multiple elements
- Drag to add text and images
- Paste external images
- Set element coordinates, size, and rotation
- Element hyperlinks (link to webpage, link to other slide pages)
#### Text
- Rich text editing (color, highlight, font, font size, bold, italic, underline, strikethrough, subscript, inline code, quote, hyperlink, alignment, numbering, bullet points, paragraph indent, clear formatting)
- Line height
- Character spacing
- Paragraph spacing
- First line indent
- Fill color
- Border
- Shadow
- Transparency
- Vertical text
- AI Rewrite/Expand/Abbreviate
#### Images
- Crop (custom, shape, aspect ratio)
- Rounding
- Filters
- Tint (mask)
- Flip
- Border
- Shadow
- Replace image
- Reset image
- Set as background
#### Shapes
- Draw any polygon
- Draw any line (unclosed shape simulation)
- Replace shape
- Fill (solid color, gradient, image)
- Border
- Shadow
- Transparency
- Flip
- Shape format painter
- Edit text (supports rich text, similar to text element’s rich text editing)
#### Lines
- Straight lines, polylines, curves
- Color
- Width
- Style (solid, dashed, dotted)
- Endpoint style
#### Charts (bar, column, line, area, scatter, pie, donut, radar)
- Chart type conversion
- Data editing
- Background fill
- Theme color
- Coordinate system and axis text color
- Grid color
- Other chart settings
- Border
#### Tables
- Add/delete rows and columns
- Theme settings (theme color, header, total row, first column, last column)
- Merge cells
- Cell styles (fill color, text color, bold, italic, underline, strikethrough, alignment)
- Border
#### Video
- Preview cover settings
- Auto play
#### Audio
- Icon color
- Auto play
- Loop play
#### Formulas
- LaTeX editing
- Color settings
- Formula line thickness settings
### Slide Show
- Brush tools (pen/shape/arrow/highlighter annotation, eraser, blackboard mode)
- Preview all slides
- Bottom thumbnails navigation
- Timer tool
- Laser pointer
- Auto play
- Speaker view
### Mobile
- Basic editing
  - Add/delete/copy/note/undo redo pages
  - Insert text, images, rectangles, circles
  - General element operations: move, scale, rotate, copy, delete, layer adjust, align
  - Element styles: text (bold, italic, underline, strikethrough, font size, color, alignment), fill color
- Basic preview
- Play preview


# 👀 FAQ
Some common problems: [FAQ](/doc/Q&A.md)


# 🎯 Supplement
There is currently no complete development documentation, but the following documents may be of some help to you:
- [Project Directory and Data Structure](/doc/DirectoryAndData.md)
- [Fundamentals of Canvas and Elements](/doc/Canvas.md)
- [How to Customize an Element](/doc/CustomElement.md)
- [About AIPPT](/doc/AIPPT.md)

Here are some auxiliary development tools/repositories:
- Import PPTX file reference: [pptxtojson](https://github.com/pipipi-pikachu/pptxtojson)
- Draw shape: [svgPathCreator](https://github.com/pipipi-pikachu/svgPathCreator)


# 📄 License
[AGPL-3.0 License](https://github.com/pipipi-pikachu/PPTist/blob/master/LICENSE) | Copyright © 2020-PRESENT [pipipi-pikachu](https://github.com/pipipi-pikachu)

# 🧮 Commercial
If you wish to use this project for commercial gain, I hope you will respect open source and strictly adhere to the AGPL-3.0 license, giving back to the open source community. Or contact the author for an independent commercial license.





# 🧮 商业用途
- 本项目禁止闭源商用，如果你希望将PPTist用于商业项目盈利，请尊重开源，**严格遵循 [AGPL-3.0 协议](https://www.gnu.org/licenses/agpl-3.0.html)**，回馈开源社区（这是作者倡导的）；
- 如果你因为任何原因，必须要闭源商用，无法执行 AGPL-3.0 协议，可以选择：
    1. 使用早期的 Apache 2.0 协议版本 [（该版本最后更新时间为2022年5月，目前已停止维护，点击此处可下载代码）](https://github.com/pipipi-pikachu/PPTist/archive/f1a35bb8e045124e37dcafd6acbf40b4531b69aa.zip)；
    2. 成为项目的重要贡献者，包括：
        - 你的代码被本项目作为依赖引用，包括：npm安装、script/style等文件引用、代码片段引用（引用处会注明）；
        - 你给本项目提交过重要的 PR 或 Issue（由作者主观判断，符合的 PR 或 Issue 会打上`important contribution`标签）；
        - 你长期参与到本项目的维护/推进工作中，如为本项目：提供了有效的周边工具、制作了大量模板等（由作者主观判断）；
        - 先违反协议后再成为贡献者不适用此项；
    3. [邮件联系作者](mailto:pipipi_pikachu@163.com)付费获取独立的商业授权。独立授权价格：
        - 一年1999元；
        - 三年2999元；
        - 永久5499元（不含税）；
        - 违反协议后被作者找到的，不适用于以上价格；
- 建议优先考虑执行AGPL-3.0协议，如需付费获取独立的商业授权，还请注意：
    - 独立商业授权表示：作者单独出具商业授权协议文件，授权您将代码用于商业行为，且不必执行 AGPL-3.0 协议；
    - 授权不等于出售软件或服务，不存在其他“商业版本/完整版本”、不提供任何API/SDK/在线服务/技术支持/技术咨询/定制开发、也不提供可直接交付的产品；
    - 该软件无法开箱即用，至少也得自行接入后端数据读取/存储相关能力。因此，使用本项目需要有最基本的web开发经验（能理解什么是前端&后端、什么是接口/数据库、什么是跨域等）；
    - 授权后，仍禁止将源代码二次售卖、授权、开源或恶意传播；
    - 授权后，如有需要，作者可提供当前AIPPT相关后台代码以供参考（但都非常简单，无任何核心逻辑，更建议自己实现）；
    - 请务必提前做好基础调研，判断PPTist是否符合需求，包括：功能（是否能满足业务需求）和开发（是否接受当前技术栈/实现方案）；
    - 不接受[黑名单/耻辱柱](/doc/Blacklist.md)对象通过付费获取独立的商业授权或贡献代码；
    - 作者倡导异步沟通（正式、信息量大、信息整合度高），**不加私人微信/QQ/手机号等**，有任何授权相关疑问请邮件联系，谢谢理解；
    - 单纯的提需求/报bug/询问技术方案等非授权相关咨询，请在 [Issues](https://github.com/pipipi-pikachu/PPTist/issues) 中进行。作者不接受邮件提需求/报bug/询问技术方案。

---
# 🔔 其他说明
## 什么是 AGPL-3.0 协议
协议的核心要求用通俗的语言解释如下：
- **开源义务**：如果你用了 AGPL 的代码，无论你或你的下游怎么使用/修改，都必须把你最终的代码全部完整公开出来（不只是给出修改的部分，也不是说换个框架重写一遍就能和原始代码脱离关系了），并继续以 AGPL 协议开源（强调：必须延续 AGPL 协议，保持开源的传染性，不能更换其他协议）。
- **网络服务也要开源**：即使你只是用 AGPL 的代码做了一个网站或网络服务，别人通过网络用你的服务时，你也需要遵守上一条**开源义务**。
- **保留版权声明**：你不能删掉代码里原来的作者信息和许可证声明，得告诉大家这代码是从哪儿来的。
- **不能加额外限制**：你不能在衍生出来的 AGPL 代码上加一些限制，比如不让别人再分发代码，或者要求别人付费才能使用代码（包括但不限于：要求别人购买授权/服务/产品等）。
- **免责声明**：作者不保证代码没有 bug，也不对使用后果负责。

> 详细协议内容见官方文档：[AGPL-3.0 协议](https://www.gnu.org/licenses/agpl-3.0.html)

## 声明
Github、Gitee等代码托管平台存在一些仓库基于本项目代码进行了二次开发，但未遵守AGPL-3.0协议，擅自删除了AGPL-3.0协议许可证声明或改用其他协议，作者在此声明：**这些仓库的代码在事实上仍然属于AGPL-3.0协议，切勿受其误导。**