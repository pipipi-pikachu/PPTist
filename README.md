<p align="center">
    <img src='/public/icons/android-chrome-192x192.png' />
</p>

<p align="center">
    <a href="https://www.github.com/pipipi-pikachu/PPTist/stargazers" target="_black"><img src="https://img.shields.io/github/stars/pipipi-pikachu/PPTist?logo=github" alt="stars" /></a>
    <a href="https://www.github.com/pipipi-pikachu/PPTist/network/members" target="_black"><img src="https://img.shields.io/github/forks/pipipi-pikachu/PPTist?logo=github" alt="forks" /></a>
    <a href="https://www.github.com/pipipi-pikachu/PPTist/blob/master/LICENSE" target="_black"><img src="https://img.shields.io/github/license/pipipi-pikachu/PPTist?color=%232DCE89&logo=github" alt="license" /></a>
    <a href="https://www.typescriptlang.org" target="_black"><img src="https://img.shields.io/badge/language-TypeScript-blue.svg" alt="language"></a>
    <a href="https://github.com/pipipi-pikachu/PPTist/issues" target="_black"><img src="https://img.shields.io/github/issues-closed/pipipi-pikachu/PPTist.svg" alt="issue"></a>
</p>

[简体中文](README_zh.md) | English


# 🎨 PPTist
> PowerPoint-ist（/'pauəpɔintist/）, A web-based presentation (slideshow) application. This application replicates most of the commonly used features of Microsoft Office PowerPoint. It supports various essential element types such as text, images, shapes, lines, charts, tables, videos, audio, and formulas. You can edit and present slides directly in a web browser.

<b>Try it online👉：[https://pipipi-pikachu.github.io/PPTist/](https://pipipi-pikachu.github.io/PPTist/)</b>

# ✨ Highlights
1. <b>Easy Development</b>: Built with Vue 3.x and TypeScript, it does not rely on UI component libraries and avoids third-party components as much as possible. This makes styling customization easier and functionality extension more convenient.
2. <b>User Friendly</b>: It offers a context menu available everywhere, dozens of keyboard shortcuts, and countless editing detail optimizations, striving to replicate a desktop application-level experience.
3. <b>Feature Rich</b>: Supports most of the commonly used elements and functionalities found in PowerPoint, supports generate PPT by AI, supports exporting in various formats, and offers basic editing and previewing on mobile devices.


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
- 本项目禁止闭源商用，如果你希望将PPTist用于商业项目盈利，请尊重开源，**严格遵循 [AGPL-3.0 协议](https://www.gnu.org/licenses/agpl-3.0.html)**，回馈开源社区；
- 如果你因为任何原因，必须要闭源商用，无法执行 AGPL-3.0 协议，可以选择：
    1. 使用早期的 Apache 2.0 协议版本 [（该版本最后更新时间为2022年5月，目前已停止维护，点击此处可下载代码）](https://github.com/pipipi-pikachu/PPTist/archive/f1a35bb8e045124e37dcafd6acbf40b4531b69aa.zip)；
    2. 成为项目的重要贡献者（先违反协议后再成为贡献者不在此项范围），包括：
        - 你的代码被本项目作为依赖引用，包括：npm安装、script/style等文件引用、代码片段引用（引用处会注明）；
        - 你给本项目提交过重要的 PR 并且被合并（由作者主观判断）；
        - 你长期参与到本项目的维护/推进工作中，如为本项目：提供了有效的周边工具、制作了大量模板等（由作者主观判断）；
    3. [邮件联系作者](mailto:pipipi_pikachu@163.com)付费获取独立的商业授权。独立授权价格：
        - 一年1999（无发票）
        - 三年2999（无发票）
        - 永久5499（无发票）
        - 永久6999（可开电子发票）
- 如需付费获取独立的商业授权，请注意：
    - 独立商业授权的意思是：单独授权您将代码用于商业行为，且不必执行 AGPL-3.0 协议；
    - 不提供额外的“高级版本”和技术支持，也不提供可直接交付的产品；
    - 如有需要，可提供AIPPT相关后台逻辑和当前模板数据（但都非常简单，建议自己实现）；
    - 务必提前做好调研，判断PPTist是否符合需求（无论功能还是开发）。

---
# 🔔 其他说明
## 什么是 AGPL-3.0 协议
协议的核心要求用通俗的语言解释如下：
- **开源义务**：如果你用了 AGPL 的代码，无论你或你的下游怎么使用/修改，都必须把你最终的代码全部完整公开出来（不只是给出修改的部分），并继续以 AGPL 协议开源，保持开源的传染性。
- **网络服务也要开源**：哪怕你只是用 AGPL 的代码做了一个网站或网络服务，别人通过网络用你的服务时，你也需要遵守上一条**开源义务**。
- **保留版权声明**：你不能删掉代码里原来的作者信息和许可证声明，得告诉大家这代码是从哪儿来的。
- **不能加额外限制**：你不能在 AGPL 代码上加一些限制，比如不让别人再分发，或者要求别人付费才能使用代码。
- **免责声明**：作者不保证代码没有 bug，也不对使用后果负责。

详细协议内容见官方文档：[AGPL-3.0 协议](https://www.gnu.org/licenses/agpl-3.0.html)

## 问题反馈
- 提需求/报bug/询问技术方案等请在 [Issues](https://github.com/pipipi-pikachu/PPTist/issues) 中进行，而不是邮件；
- 确保问题的内容不是 [Issues](https://github.com/pipipi-pikachu/PPTist/issues)（特别是置顶 Issues）和 [常见问题](/doc/Q&A.md) 中已经存在的。