'use strict';

var prosemirrorModel = require('prosemirror-model');
var pDOM = ["p", 0],
  blockquoteDOM = ["blockquote", 0],
  hrDOM = ["hr"],
  preDOM = ["pre", ["code", 0]],
  brDOM = ["br"];
var nodes = {
  doc: {
    content: "block+"
  },
  paragraph: {
    content: "inline*",
    group: "block",
    parseDOM: [{
      tag: "p"
    }],
    toDOM: function toDOM() {
      return pDOM;
    }
  },
  blockquote: {
    content: "block+",
    group: "block",
    defining: true,
    parseDOM: [{
      tag: "blockquote"
    }],
    toDOM: function toDOM() {
      return blockquoteDOM;
    }
  },
  horizontal_rule: {
    group: "block",
    parseDOM: [{
      tag: "hr"
    }],
    toDOM: function toDOM() {
      return hrDOM;
    }
  },
  heading: {
    attrs: {
      level: {
        "default": 1,
        validate: "number"
      }
    },
    content: "inline*",
    group: "block",
    defining: true,
    parseDOM: [{
      tag: "h1",
      attrs: {
        level: 1
      }
    }, {
      tag: "h2",
      attrs: {
        level: 2
      }
    }, {
      tag: "h3",
      attrs: {
        level: 3
      }
    }, {
      tag: "h4",
      attrs: {
        level: 4
      }
    }, {
      tag: "h5",
      attrs: {
        level: 5
      }
    }, {
      tag: "h6",
      attrs: {
        level: 6
      }
    }],
    toDOM: function toDOM(node) {
      return ["h" + node.attrs.level, 0];
    }
  },
  code_block: {
    content: "text*",
    marks: "",
    group: "block",
    code: true,
    defining: true,
    parseDOM: [{
      tag: "pre",
      preserveWhitespace: "full"
    }],
    toDOM: function toDOM() {
      return preDOM;
    }
  },
  text: {
    group: "inline"
  },
  image: {
    inline: true,
    attrs: {
      src: {
        validate: "string"
      },
      alt: {
        "default": null,
        validate: "string|null"
      },
      title: {
        "default": null,
        validate: "string|null"
      }
    },
    group: "inline",
    draggable: true,
    parseDOM: [{
      tag: "img[src]",
      getAttrs: function getAttrs(dom) {
        return {
          src: dom.getAttribute("src"),
          title: dom.getAttribute("title"),
          alt: dom.getAttribute("alt")
        };
      }
    }],
    toDOM: function toDOM(node) {
      var _node$attrs = node.attrs,
        src = _node$attrs.src,
        alt = _node$attrs.alt,
        title = _node$attrs.title;
      return ["img", {
        src: src,
        alt: alt,
        title: title
      }];
    }
  },
  hard_break: {
    inline: true,
    group: "inline",
    selectable: false,
    parseDOM: [{
      tag: "br"
    }],
    toDOM: function toDOM() {
      return brDOM;
    }
  }
};
var emDOM = ["em", 0],
  strongDOM = ["strong", 0],
  codeDOM = ["code", 0];
var marks = {
  link: {
    attrs: {
      href: {
        validate: "string"
      },
      title: {
        "default": null,
        validate: "string|null"
      }
    },
    inclusive: false,
    parseDOM: [{
      tag: "a[href]",
      getAttrs: function getAttrs(dom) {
        return {
          href: dom.getAttribute("href"),
          title: dom.getAttribute("title")
        };
      }
    }],
    toDOM: function toDOM(node) {
      var _node$attrs2 = node.attrs,
        href = _node$attrs2.href,
        title = _node$attrs2.title;
      return ["a", {
        href: href,
        title: title
      }, 0];
    }
  },
  em: {
    parseDOM: [{
      tag: "i"
    }, {
      tag: "em"
    }, {
      style: "font-style=italic"
    }, {
      style: "font-style=normal",
      clearMark: function clearMark(m) {
        return m.type.name == "em";
      }
    }],
    toDOM: function toDOM() {
      return emDOM;
    }
  },
  strong: {
    parseDOM: [{
      tag: "strong"
    }, {
      tag: "b",
      getAttrs: function getAttrs(node) {
        return node.style.fontWeight != "normal" && null;
      }
    }, {
      style: "font-weight=400",
      clearMark: function clearMark(m) {
        return m.type.name == "strong";
      }
    }, {
      style: "font-weight",
      getAttrs: function getAttrs(value) {
        return /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null;
      }
    }],
    toDOM: function toDOM() {
      return strongDOM;
    }
  },
  code: {
    parseDOM: [{
      tag: "code"
    }],
    toDOM: function toDOM() {
      return codeDOM;
    }
  }
};
var schema = new prosemirrorModel.Schema({
  nodes: nodes,
  marks: marks
});
exports.marks = marks;
exports.nodes = nodes;
exports.schema = schema;
