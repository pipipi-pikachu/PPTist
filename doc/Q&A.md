## 常见问题

#### Q. 为什么xxx快捷键没有作用？

A. 部分快捷键需要聚焦到指定区域才会生效，例如焦点在左边缩略图列表才能使用操作页面的快捷键，焦点在画布区域才能使用操作元素的快捷键。

#### Q. 为什么粘贴没有作用？

A. 请注意允许浏览器访问系统剪贴板。

#### Q. 为什么浏览器刷新或重新打开后，之前做的PPT没有了？

A. 仓库提供的链接仅供演示，且该项目是纯前端部署的，没有后台，不会保存数据。

#### Q. 如何调整幻灯片页面的顺序？

A. 按住左侧缩略图可进行拖拽调整顺序。

#### Q. 为什么插入图片后会出现操作卡顿的情况？

A. 由于本演示项目不依赖后端，插入本地图片实际引用的是Base64，导致数据体积非常大，在真正的生产环境中应该上传图片后引用图片地址，就不会出现这样的情况了。

#### Q. 为什么应用预置主题后没有效果？

A. 设置预置主题的作用是使新添加的元素和页面应用主题样式，不会对已有的元素和页面生效，您可以使用“应用主题到全部”功能，将当前主题应用到全部页面中。

#### Q. 设置在线字体不生效？

A. 设置在线字体时会下载对应的字体文件，该文件较大，需要等待下载完成后才会应用新的字体。

#### Q. 关于导入导出PPTX文件

A. 作为一个在线幻灯片应用，导出、导入 PPTX 文件是非常重要的功能，但是经过调研发现，该功能实现起来的复杂度远超过了预期。由于个人能力和时间有限，这部分功能只能借助第三方的轮子来完成。

导出：目前导出功能主要基于 [PptxGenJS](https://github.com/gitbrent/PptxGenJS/) 完成，能够实现大多数基本元素的导出，但还有非常多的缺陷需要一点点完善。同时需要知晓的是：1、该功能依赖 PptxGenJS，对于该库本身无法实现的部分（如动画），本项目也无能为力；2、导出功能的目标只是【导出样式尽可能一致的元素】，而不是一比一将网页还原到PPT，一些样式差异是必然存在的。

导入：导入功能目前暂时没有合适的解决方案，还在调研和观望中。如果有感兴趣或做过相关内容的朋友，欢迎来 issues 中讨论。

> PS. 我做了一个 [pptx转json](https://github.com/pipipi-pikachu/pptx2json) 的实验，如果你急需实现导入PPTX文件功能，可以此为参考自行实现。

同时补充一点，本项目不是 office PPT 的专属在线编辑器，本质上与 office PPT 没有任何关系。【导入/导出 ppt 文件】只是项目的一个[功能]而非[目的]。

#### Q. 视频元素支持哪些格式？

A. 本项目只提供最基础的视频能力，正常状态下可以播放video标签本身支持的格式。

此外，可以额外引入 [hls.js](https://github.com/video-dev/hls.js) 或 [flv.js](https://github.com/Bilibili/flv.js) 来支持对应的格式（.m3u8 .flv），你只需要在项目中引入对应的文件（如cdn）即可，无需其他配置。

#### Q. 关于导入JSON文件

A. 首先，出于安全等原因，个人并不建议将这种功能在前端直接暴露给用户，或者说用户根本就不应该接触到JSON这种格式（甚至导出JSON功能的初衷也只是为了方便开发）。如果真的有相关的需求，请自行在服务端实现，核心在于做好进行数据的校验，前端实现也是一样。

#### Q. 打印 / 导出 PDF 样式与实际有出入

A. 请注意在浏览器弹出的打印窗口调整相关的设置。建议：设置边距为【默认】、取消勾选【页眉和页脚】、勾选【背景图形】

#### Q. 为什么移动端不支持 xxx 功能？

A. 首先需要明确的一点，就是移动端无论怎么做，体验上都是必然大不如 PC 端的。因此个人将移动端定位为：简单进行一些临时处理的应急使用。真正的设计/制作幻灯片应在电脑上使用完整的功能。如实在有移动端的特殊需求，可尝试在移动端使用电脑模式打开（当然，体验会更槽糕），或者开发者自己进行二次开发。

#### Q. 关于兼容性？

A. 本项目优先兼容Chrome、Firefox。在Safari下可能存在部分兼容性问题。不兼容IE。

#### Q. 为什么不是NPM包？

A. 大家都知道，对于一般的插件/库而言，一个封装好的npm包能够更方便的接入现有的项目中，但PPTist是特殊的，这是一个完整的程序，而不是作为程序的一部分存在。如果你需要使用PPTist，那么我认为你必然需要在此基础上做很多定制化的开发，包括但不限于：与后台的通信、各种模板和预置素材、新的元素类型、使用其他方案实现现有的某些元素、自己的主题、更换快捷键，等等……而不是仅仅安装一个和现有demo一样的东西就行了（这样虽然方便，但在实际的产品开发中没有任何意义）。正如前面所列举的，需要可配置的东西太多了，如果作为一个插件的存在，很难兼顾得了，或者说这样做的开发量是巨大的，目前个人还承担不起。

因此，使用PPTist开发项目正确的做法是：拉取完整的代码、尝试理解它、基于它改造你自己的东西。社区中也不乏类似的项目，例如 [drawio](https://github.com/jgraph/drawio)

#### Q. 其他

A. 另外，还是没有后台的缘故（没有多余的钱去买服务器或云服务），一些功能我是刻意砍掉的，哪怕这些功能其实很基础，例如上传音视频、例如自定义模板。还有一些功能明明有更好的实现方案，我却没有选择，例如导出PDF。这些需要依靠开发者们自己去实现和完善了。

## FAQ
#### Q. Why doesn’t the xxx shortcut work?

A. Some shortcuts only work when the focus is on a specific area. For example, the shortcuts for operating pages only work when the focus is on the thumbnail list on the left, and the shortcuts for operating elements only work when the focus is on the canvas area.

#### Q. Why isn’t pasting working?

A. Please make sure to allow the browser access to the system clipboard.

#### Q. Why do my previous PPT disappear after refreshing or reopening the browser?

A. The links provided by the repository are for demonstration purposes only, and the project is deployed as a pure front-end application without a backend, thus it does not save data.

#### Q. How do I adjust the order of slides?

A. You can drag and drop the thumbnails on the left to adjust the order.

#### Q. Why does the application become unresponsive after inserting images?

A. Since this demo project does not rely on a backend, inserting local images actually references Base64 encoded data, which can result in very large data sizes. In a real production environment, you should upload images and reference their addresses to avoid this issue.

#### Q. Why doesn’t the preset theme take effect after being applied?

A. Applying a preset theme affects new elements and pages added, but will not apply to existing elements and pages. You can use the “Apply Theme to All” feature to apply the current theme to all pages.

#### Q. Why doesn’t setting an online font work?

A. Setting an online font involves downloading the corresponding font file, which can be large and requires time to complete the download before the new font is applied.

#### Q. About Importing and Exporting PPTX Files

A. As an online presentation application, the ability to import and export PPTX files is very important. However, it has been found that the complexity of implementing this feature far exceeds expectations. Due to limited personal capacity and time, this functionality can only be achieved with the help of third-party solutions.

Export: The current export function is mainly based on [PptxGenJS](https://github.com/gitbrent/PptxGenJS/), and it can export most basic elements, but there are still many defects that need to be improved. It’s important to note that: 1) This feature relies on PptxGenJS, and for parts that the library itself cannot implement (such as animations), there’s nothing this project can do; 2) The goal of the export function is to export elements with styles as consistent as possible, not to recreate the web page one-to-one in PPT, and some style differences are inevitable.

Import: The import function currently does not have a suitable solution and is still under investigation. If you are interested or have experience in related areas, please discuss in the issues.

> PS. I made an experimental [pptx to json](https://github.com/pipipi-pikachu/pptx2json) converter. If you urgently need to implement the import PPTX file function, you can use this as a reference for your own implementation.

It should be noted that this project is not an exclusive online editor for Office PPT. It is essentially unrelated to Office PPT. The [import/export of PPT files] is just a [feature] of the project, not its [purpose].

#### Q. Which video formats are supported?

A. This project only provides basic video capabilities and can play formats supported by the video tag in normal conditions.

Additionally, you can introduce [hls.js](https://github.com/video-dev/hls.js) or [flv.js](https://github.com/Bilibili/flv.js) to support corresponding formats (.m3u8 .flv) by simply including the corresponding files (such as CDN) in your project, without any other configuration required.

#### Q. About Importing JSON Files

A. Firstly, due to security reasons, I do not recommend exposing such functionality directly to users on the front end, or users should not even come into contact with formats like JSON in the first place (even the export JSON feature was initially intended only for development convenience). If there is a real need, please implement it on the server side, with a focus on data validation, and the same goes for the front end.

#### Q. Print / Export PDF Styles Are Different from the Actual

A. Please adjust the settings in the print dialog that pops up in the browser. It is recommended to set the margins to [default], uncheck [headers and footers], and check [background graphics].

#### Q. Why doesn’t the mobile version support xxx feature?

A. The first thing to clarify is that the mobile experience will inevitably be inferior to the PC experience no matter what. Therefore, the mobile version is positioned for simple, temporary handling in emergency situations. True design and creation of slides should be done on a computer with full functionality. If there is a specific need for the mobile version, you can try opening it in desktop mode on mobile (of course, the experience will be worse), or the developer can do further custom development.

#### Q. About Compatibility?

A. This project prioritizes compatibility with Chrome and Firefox. There may be some compatibility issues under Safari. It is not compatible with IE.

#### Q. Why isn’t it an NPM package?

A. Everyone knows that for general plugins/libraries, a well-packaged NPM package can more easily integrate into existing projects. However, PPTist is special; it is a complete program, not a part of another program. If you need to use PPTist, I believe you will necessarily need to do a lot of custom development based on it, including but not limited to: communication with the backend, various templates and pre-installed materials, new element types, using other solutions to implement certain existing elements, your own themes, changing shortcuts, and so on… It’s not just about installing something that is the same as the existing demo (which may be convenient but has no practical significance in actual product development). As previously mentioned, there are many things that need to be configurable, and it would be difficult to cater to all these needs if it were an NPM plugin. The development effort would be enormous, and currently, I cannot afford it.

Therefore, the correct way to develop a project using PPTist is to pull the complete code, try to understand it, and modify it to suit your own needs. There are also similar projects in the community, such as [drawio](https://github.com/jgraph/drawio).

#### Q. Other

A. Additionally, due to the absence of a backend (and no extra money to buy servers or cloud services), some features are deliberately omitted, even though they are quite basic, such as uploading audio and video, or custom templates. There are also features that have better implementation options, but I have not chosen them, such as exporting to PDF. These will need to be implemented and improved by developers.
