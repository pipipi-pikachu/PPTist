<h1 align="center">PptxGenJS</h1>
<h5 align="center">
  Create JavaScript PowerPoint Presentations
</h5>
<p align="center">
  <a href="https://github.com/gitbrent/PptxGenJS/">
    <img alt="PptxGenJS Sample Slides" title="PptxGenJS Sample Slides" src="https://raw.githubusercontent.com/gitbrent/PptxGenJS/gh-pages/img/readme_banner.png"/>
  </a>
</p>
<br/>

[![Known Vulnerabilities](https://snyk.io/test/npm/pptxgenjs/badge.svg)](https://snyk.io/test/npm/pptxgenjs) [![npm downloads](https://img.shields.io/npm/dm/pptxgenjs.svg)](https://www.npmjs.com/package/pptxgenjs) [![jsdelivr downloads](https://data.jsdelivr.com/v1/package/gh/gitbrent/pptxgenjs/badge)](https://www.jsdelivr.com/package/gh/gitbrent/pptxgenjs) [![typescripts definitions](https://img.shields.io/npm/types/pptxgenjs)](https://img.shields.io/npm/types/pptxgenjs)

# Table of Contents

- [Table of Contents](#table-of-contents)
- [Introduction](#introduction)
- [Features](#features)
	- [Works Everywhere](#works-everywhere)
	- [Full Featured](#full-featured)
	- [Simple and Powerful](#simple-and-powerful)
	- [Export Your Way](#export-your-way)
	- [HTML to PowerPoint](#html-to-powerpoint)
- [Live Demos](#live-demos)
- [Installation](#installation)
	- [Npm](#npm)
	- [Yarn](#yarn)
	- [CDN](#cdn)
	- [Download](#download)
	- [Additional Builds](#additional-builds)
- [Documentation](#documentation)
	- [Quick Start Guide](#quick-start-guide)
		- [Angular/React, ES6, TypeScript](#angularreact-es6-typescript)
		- [Script/Web Browser](#scriptweb-browser)
	- [Library API](#library-api)
	- [HTML-to-PowerPoint Feature](#html-to-powerpoint-feature)
- [Library Ports](#library-ports)
- [Issues / Suggestions](#issues--suggestions)
- [Need Help?](#need-help)
- [Contributors](#contributors)
- [Sponsor Us](#sponsor-us)
- [License](#license)

# Introduction

This library creates Open Office XML (OOXML) Presentations which are compatible with Microsoft PowerPoint, Apple Keynote, and other applications.

# Features

## Works Everywhere

- Every modern desktop and mobile browser is supported
- Integrates with Node, Angular, React, and Electron
- Compatible with PowerPoint, Keynote, and more

## Full Featured

- All major object types are available (charts, shapes, tables, etc.)
- Master Slides for academic/corporate branding
- SVG images, animated gifs, YouTube videos, RTL text, and Asian fonts

## Simple and Powerful

- The absolute easiest PowerPoint library to use
- Learn as you code will full typescript definitions included
- Tons of demo code comes included (over 75 slides of features)

## Export Your Way

- Exports files direct to client browsers with proper MIME-type
- Other export formats available: base64, blob, stream, etc.
- Presentation compression options and more

## HTML to PowerPoint

- Includes powerful [HTML-to-PowerPoint](#html-to-powerpoint-feature) feature to transform HTML tables into presentations with a single line of code

# Live Demos

Visit the demos page to create a simple presentation to see how easy it is to use pptxgenjs, or check out the complete demo which showcases every available feature.

- [PptxGenJS Demos](https://gitbrent.github.io/PptxGenJS/demos/)

# Installation

## Npm

[PptxGenJS NPM Home](https://www.npmjs.com/package/pptxgenjs)

```bash
npm install pptxgenjs --save
```

## Yarn

```bash
yarn add pptxgenjs
```

## CDN

[jsDelivr Home](https://www.jsdelivr.com/package/gh/gitbrent/pptxgenjs)

Bundle: Modern Browsers and IE11

```html
<script src="https://cdn.jsdelivr.net/gh/gitbrent/pptxgenjs@3.12.0/dist/pptxgen.bundle.js"></script>
```

Min files: Modern Browsers

```html
<script src="https://cdn.jsdelivr.net/gh/gitbrent/pptxgenjs@3.12.0/libs/jszip.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/gitbrent/pptxgenjs@3.12.0/dist/pptxgen.min.js"></script>
```

## Download

[GitHub Latest Release](https://github.com/gitbrent/PptxGenJS/releases/latest)

Bundle: Modern Browsers

- Use the bundle for IE11 support

```html
<script src="PptxGenJS/dist/pptxgen.bundle.js"></script>
```

Min files: Modern Browsers

```html
<script src="PptxGenJS/libs/jszip.min.js"></script>
<script src="PptxGenJS/dist/pptxgen.min.js"></script>
```

## Additional Builds

- CommonJS: `dist/pptxgen.cjs.js`
- ES Module: `dist/pptxgen.es.js`

---

# Documentation

## Quick Start Guide

PptxGenJS PowerPoint presentations are created via JavaScript by following 4 basic steps:

### Angular/React, ES6, TypeScript

```typescript
import pptxgen from "pptxgenjs";

// 1. Create a new Presentation
let pres = new pptxgen();

// 2. Add a Slide
let slide = pres.addSlide();

// 3. Add one or more objects (Tables, Shapes, Images, Text and Media) to the Slide
let textboxText = "Hello World from PptxGenJS!";
let textboxOpts = { x: 1, y: 1, color: "363636" };
slide.addText(textboxText, textboxOpts);

// 4. Save the Presentation
pres.writeFile();
```

### Script/Web Browser

```javascript
// 1. Create a new Presentation
let pres = new PptxGenJS();

// 2. Add a Slide
let slide = pres.addSlide();

// 3. Add one or more objects (Tables, Shapes, Images, Text and Media) to the Slide
let textboxText = "Hello World from PptxGenJS!";
let textboxOpts = { x: 1, y: 1, color: "363636" };
slide.addText(textboxText, textboxOpts);

// 4. Save the Presentation
pres.writeFile();
```

That's really all there is to it!

---

## Library API

Full documentation and code examples are available

- [Creating a Presentation](https://gitbrent.github.io/PptxGenJS/docs/usage-pres-create/)
- [Presentation Options](https://gitbrent.github.io/PptxGenJS/docs/usage-pres-options/)
- [Adding a Slide](https://gitbrent.github.io/PptxGenJS/docs/usage-add-slide/)
- [Slide Options](https://gitbrent.github.io/PptxGenJS/docs/usage-slide-options/)
- [Saving a Presentation](https://gitbrent.github.io/PptxGenJS/docs/usage-saving/)
- [Master Slides](https://gitbrent.github.io/PptxGenJS/docs/masters/)
- [Adding Charts](https://gitbrent.github.io/PptxGenJS/docs/api-charts/)
- [Adding Images](https://gitbrent.github.io/PptxGenJS/docs/api-images/)
- [Adding Media](https://gitbrent.github.io/PptxGenJS/docs/api-media/)
- [Adding Shapes](https://gitbrent.github.io/PptxGenJS/docs/api-shapes/)
- [Adding Tables](https://gitbrent.github.io/PptxGenJS/docs/api-tables/)
- [Adding Text](https://gitbrent.github.io/PptxGenJS/docs/api-text/)
- [Speaker Notes](https://gitbrent.github.io/PptxGenJS/docs/speaker-notes/)
- [Using Scheme Colors](https://gitbrent.github.io/PptxGenJS/docs/shapes-and-schemes/)
- [Integration with Other Libraries](https://gitbrent.github.io/PptxGenJS/docs/integration/)

---

## HTML-to-PowerPoint Feature

Easily convert HTML tables to PowerPoint presentations in a single call.

```javascript
let pptx = new PptxGenJS();
pptx.tableToSlides("tableElementId");
pptx.writeFile({ fileName: "html2pptx-demo.pptx" });
```

Learn more:

- [HTML-to-PowerPoint Docs/Demo](https://gitbrent.github.io/PptxGenJS/html2pptx/)

---

# Library Ports

React: [react-pptx](https://github.com/wyozi/react-pptx) - thanks to [Joonas](https://github.com/wyozi)!

---

# Issues / Suggestions

Please file issues or suggestions on the [issues page on github](https://github.com/gitbrent/PptxGenJS/issues/new), or even better, [submit a pull request](https://github.com/gitbrent/PptxGenJS/pulls). Feedback is always welcome!

When reporting issues, please include a code snippet or a link demonstrating the problem.
Here is a small [jsFiddle](https://jsfiddle.net/gitbrent/L1uctxm0/) that is already configured and uses the latest PptxGenJS code.

---

# Need Help?

Sometimes implementing a new library can be a difficult task and the slightest mistake will keep something from working. We've all been there!

If you are having issues getting a presentation to generate, check out the code in the `demos` directory. There
are demos for both client browsers, node and react that contain working examples of every available library feature.

- Use a pre-configured jsFiddle to test with: [PptxGenJS Fiddle](https://jsfiddle.net/gitbrent/L1uctxm0/)
- [View questions tagged `PptxGenJS` on StackOverflow](https://stackoverflow.com/questions/tagged/pptxgenjs?sort=votes&pageSize=50). If you can't find your question, [ask it yourself](https://stackoverflow.com/questions/ask?tags=PptxGenJS) - be sure to tag it `PptxGenJS`.

---

# Contributors

Thank you to everyone for the issues, contributions and suggestions! ❤️

Special Thanks:

- [Dzmitry Dulko](https://github.com/DzmitryDulko) - Getting the project published on NPM
- [Michal Kacerovský](https://github.com/kajda90) - New Master Slide Layouts and Chart expertise
- [Connor Bowman](https://github.com/conbow) - Adding Placeholders
- [Reima Frgos](https://github.com/ReimaFrgos) - Multiple chart and general functionality patches
- [Matt King](https://github.com/kyrrigle) - Chart expertise
- [Mike Wilcox](https://github.com/clubajax) - Chart expertise
- [Joonas](https://github.com/wyozi) - React port

PowerPoint shape definitions and some XML code via [Officegen Project](https://github.com/Ziv-Barber/officegen)

---

# Sponsor Us

If you find this library useful, please consider sponsoring us through a [donation](https://gitbrent.github.io/PptxGenJS/sponsor/)

---

# License

Copyright &copy; 2015-present [Brent Ely](https://github.com/gitbrent/PptxGenJS)

[MIT](https://github.com/gitbrent/PptxGenJS/blob/master/LICENSE)
