import { NodeSpec, MarkSpec, Schema } from 'prosemirror-model';

/**
[Specs](https://prosemirror.net/docs/ref/#model.NodeSpec) for the nodes defined in this schema.
*/
declare const nodes: {
    /**
    NodeSpec The top level document node.
    */
    doc: NodeSpec;
    /**
    A plain paragraph textblock. Represented in the DOM
    as a `<p>` element.
    */
    paragraph: NodeSpec;
    /**
    A blockquote (`<blockquote>`) wrapping one or more blocks.
    */
    blockquote: NodeSpec;
    /**
    A horizontal rule (`<hr>`).
    */
    horizontal_rule: NodeSpec;
    /**
    A heading textblock, with a `level` attribute that
    should hold the number 1 to 6. Parsed and serialized as `<h1>` to
    `<h6>` elements.
    */
    heading: NodeSpec;
    /**
    A code listing. Disallows marks or non-text inline
    nodes by default. Represented as a `<pre>` element with a
    `<code>` element inside of it.
    */
    code_block: NodeSpec;
    /**
    The text node.
    */
    text: NodeSpec;
    /**
    An inline image (`<img>`) node. Supports `src`,
    `alt`, and `href` attributes. The latter two default to the empty
    string.
    */
    image: NodeSpec;
    /**
    A hard line break, represented in the DOM as `<br>`.
    */
    hard_break: NodeSpec;
};
/**
[Specs](https://prosemirror.net/docs/ref/#model.MarkSpec) for the marks in the schema.
*/
declare const marks: {
    /**
    A link. Has `href` and `title` attributes. `title`
    defaults to the empty string. Rendered and parsed as an `<a>`
    element.
    */
    link: MarkSpec;
    /**
    An emphasis mark. Rendered as an `<em>` element. Has parse rules
    that also match `<i>` and `font-style: italic`.
    */
    em: MarkSpec;
    /**
    A strong mark. Rendered as `<strong>`, parse rules also match
    `<b>` and `font-weight: bold`.
    */
    strong: MarkSpec;
    /**
    Code font mark. Represented as a `<code>` element.
    */
    code: MarkSpec;
};
/**
This schema roughly corresponds to the document schema used by
[CommonMark](http://commonmark.org/), minus the list elements,
which are defined in the [`prosemirror-schema-list`](https://prosemirror.net/docs/ref/#schema-list)
module.

To reuse elements from this schema, extend or read from its
`spec.nodes` and `spec.marks` [properties](https://prosemirror.net/docs/ref/#model.Schema.spec).
*/
declare const schema: Schema<"blockquote" | "image" | "text" | "doc" | "paragraph" | "horizontal_rule" | "heading" | "code_block" | "hard_break", "link" | "code" | "em" | "strong">;

export { marks, nodes, schema };
