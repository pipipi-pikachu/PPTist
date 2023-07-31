## common problem

#### Q. Why doesn't the xxx shortcut key work?

A. Some shortcut keys need to be focused on the specified area to take effect. For example, the shortcut keys of the operation page can only be used when the focus is on the thumbnail list on the left, and the shortcut keys of the operation elements can only be used when the focus is on the canvas area.

#### Q. Why does pasting not work?

A. Please pay attention to allow the browser to access the system clipboard.

#### Q. Why is the previous PPT gone after the browser is refreshed or reopened?

A. The demo project is purely front-end deployment and will not save data.

#### Q. How to adjust the order of slide pages?

A. Press and hold the left thumbnail to drag to adjust the order.

#### Q. Why does the operation freeze after inserting a picture?

A. Since this demo project does not rely on the backend, the actual reference to the inserted local image is Base64, resulting in a very large data volume. In a real production environment, the image address should be referenced after uploading the image, and this situation will not occur.

#### Q. Why is there no effect after applying the preset theme?

A. The role of setting the preset theme is to apply the theme style to newly added elements and pages, and it will not take effect on existing elements and pages. You can use the "Apply theme to all" function to apply the current theme to all pages .

#### Q. Setting the online font does not take effect?

A. When setting online fonts, the corresponding font file will be downloaded. The file is relatively large, and the new font will not be applied until the download is complete.

#### Q. About importing and exporting PPTX files

A. As an online slideshow application, exporting and importing PPTX files is a very important function, but after investigation, it was found that the complexity of implementing this function far exceeded expectations. Due to limited personal ability and time, this part of the function can only be completed with the help of third-party wheels.

Export: The current export function is mainly based on [PptxGenJS](https://github.com/gitbrent/PptxGenJS/), which can realize the export of most basic elements, but there are still many defects that need to be improved a little bit. What you need to know at the same time is: 1. This function depends on PptxGenJS, and this project can't do anything about the parts that the library itself cannot implement (such as animation); 2. The goal of the export function is only to [export elements with the same style as possible], not When restoring the webpage to PPT one by one, some style differences are bound to exist.

Import: There is currently no suitable solution for the import function, and it is still under investigation and wait-and-see. If you are interested or have done related content, welcome to discuss in issues.

> PS. I did a [pptx to json](https://github.com/supernovate07/pptx2json) experiment, if you urgently need to implement the function of importing PPTX files, you can use this as a reference to implement it yourself.

At the same time, add that this project is not an exclusive online editor for office PPT, and has nothing to do with office PPT in essence. [Import/Export ppt file] is just a [function] of the project rather than a [purpose].

#### Q. What formats does the video element support?

A. This project only provides the most basic video capabilities. Under normal conditions, the formats supported by the video tag itself can be played.

In addition, [hls.js](https://github.com/video-dev/hls.js) or [flv.js](https://github.com/Bilibili/flv.js) can be additionally introduced to support For the corresponding format (.m3u8 .flv), you only need to import the corresponding file (such as cdn) in the project, no other configuration is required.

#### Q. About importing JSON files

A. First of all, for reasons such as security, I personally do not recommend exposing this function directly to users on the front end, or that users should not have access to the JSON format at all (even the original intention of exporting the JSON function is only for the convenience of development ). If you really have relevant requirements, please implement it on the server side yourself. The core is to do a good job of data verification, and the front-end implementation is the same.

#### Q. The print/export PDF format is different from the actual one

A. Please pay attention to adjust the relevant settings in the pop-up printing window of the browser. Suggestion: set margin to [Default], uncheck [Header and Footer], check [Background Graphics]

#### Q. Why does the mobile terminal not support the xxx function?

A. First of all, it needs to be clear that no matter what you do on the mobile end, the experience will inevitably be much worse than that on the PC end. Therefore, I personally position the mobile terminal as: emergency use for simple temporary processing. The actual design/production of slideshows should be done on a computer with full functionality. If you really have special needs for the mobile terminal, you can try to open it in computer mode on the mobile terminal (of course, the experience will be worse), or the developer can carry out secondary development by himself.

#### Q. About compatibility?

A. This project is compatible with Chrome and Firefox first. There may be some compatibility issues under Safari. Not compatible with Internet Explorer.