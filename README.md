<p align="center">
     <img src='/public/icons/android-chrome-192x192.png' />
</p>

<p align="center">
     <a href="https://www.github.com/supernovate07/super-ppt/stargazers" target="_black">
         <img src="https://img.shields.io/github/stars/supernovate07/super-ppt?logo=github" alt="stars" />
     </a>
     <a href="https://www.github.com/supernovate07/super-ppt/network/members" target="_black">
         <img src="https://img.shields.io/github/forks/supernovate07/super-ppt?logo=github" alt="forks" />
     </a>
     <a href="https://www.github.com/supernovate07/super-ppt/blob/master/LICENSE" target="_black">
         <img src="https://img.shields.io/github/license/supernovate07/super-ppt?color=%232DCE89&logo=github" alt="license" />
     </a>
     <a href="https://www.typescriptlang.org" target="_black">
         <img src="https://img.shields.io/badge/language-TypeScript-blue.svg" alt="language">
     </a>
     <a href="https://github.com/supernovate07/super-ppt/issues" target="_black">
         <img src="https://img.shields.io/github/issues-closed/supernovate07/super-ppt.svg" alt="issue">
     </a>
</p>


# 🎨 super-ppt
> An online presentation (slideshow) application based on Vue3.x + TypeScript, which restores most of the common functions of Office PowerPoint, and supports text, pictures, shapes, lines, charts, tables, videos, audio, and formulas. Element type, each element has a high degree of editability, and supports rich shortcut keys and right-click menus, supports exporting local PPTX files, supports basic editing and preview on mobile terminals, and supports PWA. You can build your own online slideshow application on this basis.

<b>Online experience address: [https://supernovate07.github.io/super-ppt/](https://supernovate07.github.io/super-ppt/)</b>


# 👀 Front Row Tips
1. The goal of this project is to create an "online slideshow application", not a "low-code platform", "H5 editor" or "picture editing tool".
2. The target audience of this project is <b>developers who have the development needs of 【Web Slideshow】</b>, the link provided is just a demonstration address, and no online service is provided. You should not use this project directly as a tool, nor does it support one-click deployment.
If you just need a service or tool, you can choose more excellent and mature products, such as: [Graphite Documentation](https://shimo.im/), [Kingsoft Documentation](https://www.kdocs.cn/ ), [Slidev](https://sli.dev/), [revealjs](https://revealjs.com/), etc.
3. This project is a DOM-based rendering solution, which has the advantage of being simple and easy to use. However, compared with the Canvas rendering solution, there will be a certain gap in performance in complex scenes, so if you have high performance requirements, this project may not be a good choice/reference direction.
4. Some [FAQs](https://github.com/supernovate07/super-ppt/blob/master/doc/Q&A.md) are summarized here. When submitting Issues and PR for the first time, be sure to read this document in advance .


# 🚀 project running
```
npm install

npm run serve
```


# 📚 Feature list
### basic function
- History (undo, redo)
- hot key
- right click menu
- Export local files (PPTX, JSON, image, PDF)
- Import and export of unique .super-ppt files
- Print
### slide page editor
- Page addition, deletion
- page order adjustment
- Page copy and paste
- Background settings (solid color, gradient, image)
- Set canvas size
- Gridlines
- Ruler
- Canvas zoom, move
- Theme settings
- slide notes
- Slideshow templates
- Page flip animation
- Element animation (entry, exit, emphasis)
- Selection panel (hidden elements, hierarchical ordering, element naming)
### Slide element editing
- Element addition, deletion
- Element copy paste
- Drag and drop elements to move
- element rotation
- Element scaling
- Multiple selection of elements (box selection, click selection)
- Multi-element combination
- Multi-element batch editing
- Element locking
- Element snap alignment (move and scale)
- Element level adjustment
- Elements are snapped to the canvas
- Elements are aligned to other elements
- Even distribution of multiple elements
- Drag and drop to add pictures and texts
- Paste external pictures
- Element coordinates, size and rotation angle settings
- Element hyperlinks (links to web pages, links to other slide pages)
#### Word
- Rich text editing (color, highlight, font, font size, bold, italic, underline, strikethrough, corner mark, inline code, reference, hyperlink, alignment, serial number, bullet, indent, clear format)
- row height
- word spacing
- paragraph spacing
- First line indent
- fill color
- border
- shadow
- transparency
- vertical text
#### picture
- Cropping (custom, by shape, by aspect ratio)
- filter
- Shading (masking)
- flip
- border
- shadow
- replace picture
- reset picture
- set as background image
#### shape
- Replace shape
- fill color
- border
- shadow
- transparency
- flip
- edit text
#### Lines
- color
- width
- style
- Endpoint style
#### Charts (histogram, bar chart, line chart, area chart, scatter chart, pie chart, ring chart)
- Chart conversion
- Data editing
- background fill
- theme color
- Coordinate system and coordinate text color
- Additional chart settings
- border
- Legend
#### sheet
- Add and delete rows and columns
- Theme settings (theme color, table header, summary row, first column, last column)
- Merge Cells
- Cell styles (fill color, text color, bold, italic, underline, strikethrough, alignment)
- border
#### video
- Preview cover settings
#### Audio
- icon color
- Autoplay
- Loop
#### formula
- LaTeX editing
- color settings
- Formula line thickness setting
### Slideshow
- Full slideshow preview
- Brush, blackboard tools
- Timer tool
- laser pointer
- Auto show
- Speaker view
### Mobile
- Basic editing
     - Add, delete, copy, note, undo and redo pages
     - Insert text, picture, rectangle, circle
     - Common operations on elements: move, zoom, copy, delete, level adjustment, alignment
     - Element style: text (bold, italic, underline, strikethrough, font size, color, alignment direction), fill color
- Basic preview
- play preview


# 📅 Subsequent planning
- Reconstruction of combined elements: it can support combined elements to rotate, scale, perform animation as a whole, etc.;
- Import local PPTX files;
- export HTML file;
- Replace Vue CLI with Vite ecology;


# 🎯 Development
There is currently no complete development documentation, but the following documents may be of some help to you:
- [Project Directory and Data Structure](https://github.com/supernovate07/super-ppt/blob/master/doc/DirectoryAndData.md)
- [Basic principles of canvas and elements](https://github.com/supernovate07/super-ppt/blob/master/doc/Canvas.md)
- [How to customize an element](https://github.com/supernovate07/super-ppt/blob/master/doc/CustomElement.md)


# 💻 Contributing Code
First of all, I would like to thank the friends who pay attention to this project. Everyone who is interested in this project is very welcome to contribute code.

### The specific reference is as follows:
- fork the source code, download it locally and run the project
- Add/modify code
- <b>Completely self-test the changes (this is very important)</b>
- Submit the modification to Github after confirming that it is correct
- Submit a Pull Request

### Also note that:
- Each Pull Request should not submit too much code, and must explain the specific purpose of this change, such as: fixing a bug, optimizing a method, etc., to facilitate Code Review;
- For bug fixes, this Pull Request should be associated with the corresponding bug issue to let others know that the problem has been fixed;
- For larger new functions, you need to submit Issues first, such as "add XXX function", and then start working after confirming that the function is necessary to be added;
- For some subjective style and interaction logic adjustments: such as the use of colors and icons, the increase or decrease of some preset configurations, etc., they are generally not approved. But it can be discussed in Issues;
- Others such as simple code optimization, document correction, etc., as long as the modification is reasonable, it will be accepted.

Thanks to every contributor here.


# 📄 Open source protocol
[GPL-3.0 license](https://github.com/supernovate07/super-ppt/blob/master/LICENSE) © [supernovate07](https://github.com/supernovate07)

# 🧮 commercial use
- If you want to make this project commercially profitable, I hope you can strictly follow the GPL-3.0 agreement;
- If you really need closed-source commercial use and cannot implement the GPL-3.0 agreement, you can choose:
     1. Use [Apache 2.0 LICENSE version](https://github.com/supernovate07/super-ppt/archive/f1a35bb8e045124e37dcafd6acbf40b4531b69aa.zip);
     2. Become a contributor to the project, generally including:
         - Your code is referenced by this project as a dependency;
         - The PR you submitted is merged by this project (only valuable ones, excluding simple typos or spelling mistakes, etc.);
         - You have participated in the design and implementation of this project (including providing valuable ideas for the implementation of various functions/modules or bug fixes);
     3. Contact the author by email to pay for commercial use (to tell the truth, the current project is not very mature, I suggest you take the above path);