## Canvas and elements

#### The basic structure of the editor
```
└──Editor
     ├── In the top menu
     ├── left navigation bar
     ├── Right navigation bar
     ├── Middle and upper insert/toolbar
     ├── Bottom input field
     └── Canvas
          ├── visible area
          │ ├── editable elements
          │ └── mouse marquee
          │
          └── canvas tools
               ├── reference line
               ├── Ruler
               ├── element operation node layer (such as dragging and zooming points)
               ├── Snap alignment line
               └── Visible area background
```

#### Basic Principles of Canvas
We focus on the relatively complex [Canvas] part. Each element in the canvas is described by a set of data, for example:
```typescript
interface PPTBaseElement {
   id: string;
   left: number;
   top: number;
   width: number;
   height: number;
}
```
As the name implies, `left` indicates the position of the element from the upper left corner of the canvas, `width` indicates the width of the element, and so on.
The important thing to know is: the default ratio of the visible area is 1000 pixels wide and 562.5 pixels high. That is, no matter what the actual size of the canvas and the visible area is, an element with `{ width: 1000px, height: 562.5px, left: 0, top: 0 }` must exactly cover the entire visible area.
The specific implementation method is very simple: assuming that the actual width of the visible area is 1200px, the calculated zoom ratio at this time is 1200 / 1000 = 1.2, and then all the elements in the visible area are scaled to 1.2 times.
Similarly, [Thumbnail] and [Show Page] are actually a visual area with a smaller or larger actual size.

#### Elements in the canvas
In addition to the above position and size information, more data can be carried. Take a text element as an example:
```typescript
interface PPTTextElement {
   type: 'text';
   id: string;
   left: number;
   top: number;
   lock?: boolean;
   groupId?: string;
   width: number;
   height: number;
   link?: string;
   content: string;
   rotate: number;
   defaultFontName: string;
   defaultColor: string;
   outline?: PPTElementOutline;
   fill?: string;
   lineHeight?: number;
   wordSpace?: number;
   opacity?: number;
   shadow?: PPTElementShadow;
}
```
You can define a `rotate` to indicate the rotation angle of the text box, define an `opacity` to indicate the transparency of the text box, etc. When implementing, you only need to render element components according to the data you define, and the essence of editing elements is to modify these data.
The above is the most basic composition of a canvas.