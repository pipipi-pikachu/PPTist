export const enum KEYS {
  C = "C",
  X = "X",
  Z = "Z",
  Y = "Y",
  A = "A",
  G = "G",
  L = "L",
  F = "F",
  D = "D",
  B = "B",
  P = "P",
  O = "O",
  R = "R",
  T = "T",
  MINUS = "-",
  EQUAL = "=",
  DIGIT_0 = "0",
  DELETE = "DELETE",
  UP = "ARROWUP",
  DOWN = "ARROWDOWN",
  LEFT = "ARROWLEFT",
  RIGHT = "ARROWRIGHT",
  ENTER = "ENTER",
  SPACE = " ",
  TAB = "TAB",
  BACKSPACE = "BACKSPACE",
  ESC = "ESCAPE",
  PAGEUP = "PAGEUP",
  PAGEDOWN = "PAGEDOWN",
  F5 = "F5",
}

interface HotkeyItem {
  type: string;
  children: {
    label: string;
    value?: string;
  }[];
}

export const HOTKEY_DOC: HotkeyItem[] = [
  {
    type: "General",
    children: [
      { label: "Cut", value: "Ctrl + X" },
      { label: "Copy", value: "Ctrl + C" },
      { label: "Paste", value: "Ctrl + V" },
      { label: "Paste Plain", value: "Ctrl + Shift + V" },
      { label: "Duplicate Selected", value: "Ctrl + D" },
      { label: "Select All", value: "Ctrl + A" },
      { label: "Undo", value: "Ctrl + Z" },
      { label: "Redo", value: "Ctrl + Y" },
      { label: "Delete", value: "Delete / Backspace" },
      { label: "Select Multiple", value: "Ctrl Shift" },
      { label: "Find & Replace", value: "Ctrl + F" },
      { label: "Print", value: "Ctrl + P" },
      { label: "Close", value: "ESC" },
    ],
  },
  {
    type: "Slideshow",
    children: [
      { label: "Start from first slide", value: "F5" },
      { label: "Refresh", value: "Shift + F5" },
      { label: "Previous", value: "↑ / ← / PgUp" },
      { label: "Next", value: "↓ / → / PgDown" },
      { label: "Next Slide", value: "Enter / Space" },
      { label: "Exit", value: "ESC" },
    ],
  },
  {
    type: "Slideshow Editing",
    children: [
      { label: "Add slide", value: "Enter" },
      { label: "Drag canvas", value: "Space + 鼠标拖拽" },
      { label: "Zoom canvas", value: "Ctrl + 鼠标滚轮" },
      { label: "Enlarge canvas", value: "Ctrl + =" },
      { label: "Zoom out", value: "Ctrl + -" },
      { label: "Fit to screen", value: "Ctrl + 0" },
      { label: "Previous page", value: "↑" },
      { label: "Next page", value: "↓" },
      { label: "Previous page", value: "鼠标上滚 / PgUp" },
      { label: "Next page", value: "鼠标下滚 / PgDown" },
      { label: "Quick create", value: "双击空白处 / T" },
      { label: "Quick create rectangle", value: "R" },
      { label: "Quick creeate circle", value: "O" },
      { label: "Quick create line", value: "L" },
      { label: "Exit drawing state", value: "鼠标右键" },
    ],
  },
  {
    type: "Element Operations",
    children: [
      { label: "Move", value: "↑ / ← / ↓ / →" },
      { label: "Lock", value: "Ctrl + L" },
      { label: "Group", value: "Ctrl + G" },
      { label: "Ungroup", value: "Ctrl + Shift + G" },
      { label: "To front", value: "Alt + F" },
      { label: "To bottom", value: "Alt + B" },
      { label: "Lock aspect ratio", value: "按住 Ctrl 或 Shift" },
      {
        label: "Create horizontal/vertical lines",
        value: "按住 Ctrl 或 Shift",
      },
      { label: "Switch element focus", value: "Tab" },
      { label: "Confirm image cropping", value: "Enter" },
      { label: "Finish drawing the custom shape", value: "Enter" },
    ],
  },
  {
    type: "Table editing",
    children: [
      { label: "Focus on the next cell", value: "Tab" },
      { label: "Move the focus cell", value: "↑ / ← / ↓ / →" },
      { label: "Insert a row above", value: "Ctrl + ↑" },
      { label: "Insert a row below", value: "Ctrl + ↓" },
      { label: "Insert a column to the left", value: "Ctrl + ←" },
      { label: "Insert a column to the right", value: "Ctrl + →" },
    ],
  },
  {
    type: "Chart data editing",
    children: [{ label: "Focus on the next row", value: "Enter" }],
  },
  {
    type: "Text Editing",
    children: [
      { label: "Bold", value: "Ctrl + B" },
      { label: "Italic", value: "Ctrl + I" },
      { label: "Underline", value: "Ctrl + U" },
      { label: "Inline code", value: "Ctrl + E" },
      { label: "Superscript", value: "Ctrl + ;" },
      { label: "Subscript", value: `Ctrl + '` },
      { label: "Select paragraph", value: `ESC` },
    ],
  },
  {
    type: "Other quick operations",
    children: [
      { label: "Add Image - Paste an image from the system clipboard" },
      { label: "Add image - drag and drop local images into the canvas" },
      { label: "Add an image - paste the SVG code in the canvas" },
      { label: "Add image - paste the image link from pexels" },
      { label: "Add Text - Paste text from the system clipboard" },
      { label: "Add text - drag external selected text into the canvas" },
      {
        label:
          "Text editing - supports markdown syntax for creating lists and references",
      },
    ],
  },
];
