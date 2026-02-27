<p align="center">
    <img src='/public/logo.png' />
</p>

<p align="center">
    <a href="https://www.github.com/pipipi-pikachu/PPTist/stargazers" target="_black"><img src="https://img.shields.io/github/stars/pipipi-pikachu/PPTist?logo=github" alt="stars" /></a>
    <a href="https://www.github.com/pipipi-pikachu/PPTist/network/members" target="_black"><img src="https://img.shields.io/github/forks/pipipi-pikachu/PPTist?logo=github" alt="forks" /></a>
    <a href="https://www.github.com/pipipi-pikachu/PPTist/blob/master/LICENSE" target="_black"><img src="https://img.shields.io/github/license/pipipi-pikachu/PPTist" alt="license" /></a>
    <a href="https://www.typescriptlang.org" target="_black"><img src="https://img.shields.io/badge/language-TypeScript-blue.svg" alt="language"></a>
    <a href="https://github.com/pipipi-pikachu/PPTist/issues" target="_black"><img src="https://img.shields.io/github/issues-closed/pipipi-pikachu/PPTist.svg" alt="issue"></a>
    <a href="https://gitee.com/pptist/PPTist" target="_black"><img src="https://gitee.com/pptist/PPTist/badge/star.svg?theme=gvp" alt="gitee"></a>
    <a href="https://gitcode.com/pipipi-pikachu/PPTist" target="_black"><img src="https://gitcode.com/pipipi-pikachu/PPTist/star/badge.svg" alt="gitcode"></a>
</p>

[简体中文](README_zh.md) | English


# 🎨 PPTist
**PowerPoint-ist（/'pauəpɔintist/）**, A web-based presentation (slideshow) application. This application replicates most of the commonly used features of Microsoft Office PowerPoint. It supports various essential element types such as text, images, shapes, lines, charts, tables, videos, audio, and formulas. You can edit and present slides directly in a web browser.

**Try it online👉：[https://pipipi-pikachu.github.io/PPTist/](https://pipipi-pikachu.github.io/PPTist/)**

> China Mirrors (Synchronized Regularly): [Gitee](https://gitee.com/pptist/PPTist)、[GitCode](https://gitcode.com/pipipi-pikachu/PPTist)


# ✨ Highlights
1. **Easy Development**: Built with Vue 3.x and TypeScript, it does not rely on UI component libraries and avoids third-party components as much as possible. This makes styling customization easier and functionality extension more convenient.
2. **User Friendly**: It offers a context menu available everywhere, dozens of keyboard shortcuts, and countless editing detail optimizations, striving to replicate a desktop application-level experience.
3. **Feature Rich**: Supports most of the commonly used elements and functionalities found in PowerPoint, supports generate PPT by AI, supports exporting in various formats, and offers basic editing and previewing on mobile devices.


# 👀 Front-Row Reminder
1. The target audience for this project is developers with web slide development needs and basic web development experience. The provided link is for demonstration purposes only and does not offer any online services. This project should not be used directly as a tool, nor does it support out-of-the-box use. If you simply need a ready-made service or tool, please consider other products.
2. Here are some summarized [Frequently Asked Questions](/doc/Q&A.md). When raising Issues or submitting PRs for the first time, be sure to read this document in advance.
3. For commercial use, please refer to [商业用途](#-商业用途)


# 🧩 Project Positioning
> This project is strictly positioned as a Web Slide Editing/Presentation Application. It is not intended to be an ~~AI PPT generator, low-code platform, or image editor~~. The following are the recommendation levels for common use cases:

- **Low-code Platforms / H5 Editors / Image Editors / Whiteboards** (Recommendation: Not Recommended): We suggest choosing open-source projects specifically designed for those purposes.
- **PPT File Preview Tool** (Recommendation: ⭐): The ability to import .pptx files is limited (roughly 60% fidelity). Unless your requirements for preview accuracy are low and you only need basic content display, this is not recommended.
- **AI PPT Generation Tool** (Recommendation: ⭐⭐): While the project provides basic template-based AI generation, it is not the core focus. As AI technology evolves (moving from templates to HTML-based or image-based generation), this project will not necessarily follow those trends. However, if you wish to build a template-based AI generator and are willing to implement your own generation logic, PPTist’s robust editing capabilities make it a strong foundation.
- **Office PPT Authoring Tool** (Recommendation: ⭐⭐): PPTist supports many common Office features and basic .pptx export. However, exports are not 100% identical to the original, and as mentioned, import capabilities are limited. Choose this only if you can accept these limitations.
- **Web Slide Editing/Presentation App** (Recommendation: ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐): This is the primary use case. The core strengths of PPTist are its editing capabilities and user experience. You can build upon this project to customize or add unique nodes and features tailored to your specific needs, where Office compatibility is not the ultimate goal. **Summary: Our vision is for you to use PPTist to create a presentation product that is distinct from Microsoft Office, rather than just using it as a middleman for editing Office files.**


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
- 本项目禁止闭源商用，如果你希望将其用于商业项目，请尊重开源，**严格遵循 [AGPL-3.0 协议](https://www.gnu.org/licenses/agpl-3.0.html)**，回馈开源社区；
- 如果你因为任何原因，无法执行 AGPL-3.0 协议，可以选择：
    1. 使用早期 Apache 2.0 协议版本（最后更新时间为2022年5月，已停止维护，[点击此处下载](https://github.com/pipipi-pikachu/PPTist/archive/f1a35bb8e045124e37dcafd6acbf40b4531b69aa.zip)）；
    2. 成为项目的重要贡献者（先违反协议后再成为贡献者不适用此项），包括：
        - 你的代码被本项目作为依赖引用，包括：npm安装、文件引用、代码片段引用（引用处会注明）；
        - 你给本项目提交过重要的 PR 或 Issue（由作者主观判断，符合的 PR 或 Issue 会打上`important contribution`标签）；
    3. [邮件联系作者](mailto:pipipi_pikachu@163.com)付费获取独立的商业授权（违反协议后被作者找到的不适用此项）。独立授权价格：
        - 一年：2999元；
        - 永久：5499元（不含税）；
- 建议优先考虑执行AGPL-3.0协议，如需付费获取独立的商业授权，请务必在联系作者前阅读以下内容：
    - **独立商业授权表示**：
        - 作者单独出具商业授权协议文件（邮件联系作者获取），双方按流程签署协议；
        - 允许将代码用于商业行为，且不必执行 AGPL-3.0 协议；
        - 授权对象可以是个人或组织（企业），允许授权对象名下的所有产品使用本项目代码；
    - **授权流程**：
        1. 被授权方确认协议内容，若无异议，需提供协议中所需的个人/企业信息；
        2. 由作者补充好协议双方信息后打印签字，并将电子扫描件发给被授权方；
        3. 被授权方收到后，将协议打印盖章，再扫描电子档发回给作者，此时协议开始生效；
        4. 被授权方在协议规定时间内支付费用，并保留好支付凭证，授权结束；
    - **授权不等于出售软件或服务**：
        - 不存在其他“商业版本”、不提供任何API/SDK/在线服务/技术支持/技术咨询/定制开发；
        - 不提供可直接交付的产品，你仍需从本仓库获取代码自行开发；
        - 该软件无法开箱即用，至少也得自行接入后端能力（使用本项目需要有最基本的web开发经验）；
        - 不保证未来版本的兼容性，不保证代码没有bug；
        - 作者不承担任何因使用本项目代码而导致的直接或间接损失；
        - 务必提前做好调研，判断该软件是否符合需求，包括：功能（是否能满足业务需求）和开发（是否上手当前技术栈/实现方案）；
- 不接受[黑名单/耻辱柱](/doc/Blacklist.md)或存在违反协议行为的对象通过任何形式获取商业授权；
- 作者倡导异步沟通（正式、信息量大、信息整合度高），**不加私人微信/QQ/手机号等**，有任何授权相关疑问请邮件联系，谢谢理解；
- 提需求/报bug/询问技术方案等非授权相关咨询，请在 [Issues](https://github.com/pipipi-pikachu/PPTist/issues) 中进行。


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
Github、Gitee等代码托管平台存在一些仓库基于本项目代码进行了二次开发，但未遵守AGPL-3.0协议，擅自删除了AGPL-3.0协议许可证声明或改用其他协议，作者在此提醒：**这些仓库的代码在事实上仍然属于AGPL-3.0协议，切勿受其误导。**