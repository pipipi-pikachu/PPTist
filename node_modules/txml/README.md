# tXml
A very small and probably the fastest xml parser in pure javascript.

This lib is easy to use: `txml.parse(xml);`.

1. this code is about 255 lines, can be easily extended. 
2. this code is 1.6kb minified + gzipped.
3. this code is 5 - 10 times faster than sax/xml2js and still 2-3 times [faster than fast-xml-parser](https://github.com/tobiasnickel/fast-xml-parser#benchmark)
4. this code can running in a worker.
5. this code is parsing at average the same speed as native DOMParser + potential to be faster.
6. this code is easy to read and good for study. 
7. this code creates a domObject with minimal footprint, that is easy to traverse.
8. this code has proven in different projects, like RSS reader, openStreetMap, websites.
9. this code can even parse handwritten XML that contains various errors.
10. this code is working in client and server.
11. this code is 100% covered by unit tests.
12. this.code is extreme small, perfect for browser, node, cloud function, edge.
  
so, there are good reasons to give tXml.js a try. 

## XML - features

1. tags
2. childTags
3. text-nodes
4. white-spaces
5. attributes with single and double quotes
6. attributes without value
7. xmlComments (ignored or keep)
8. CDATA
9. embedded CSS and Javascript
10. HTML singleTag elements br, img, link, meta, hr (configurable)
11. doctype definitions
12. xml namespaces
13. sync API for a sync process
14. getElementsById/Class direct on the xmlString
15. simplify, similar to PHP's [SimpleXML](http://php.net/manual/en/book.simplexml.php)
16. simplifyLostLess
17. filter, similar to underscore, as a alternative to CSS selectors
18. monomorphism for fast processing and fewer if statements (a node always has tagName:'', attributes:{} and children:[])
19. streamSupport ! ! !
20. process stream with `for await` loop

## Try Online

Try without installing online: https://tnickel.de/2017/04/02/txml-online

## new in version 4
  - improved support for CDATA
  - option to keep comments
  - comment support for transformStream (comments inside elements are working, but not top level)
  - allow options for transformStream
  - export parser function only as `txml`, it will be the cleanest in all environments and let you use `txml.parse(xml)` where xml is the string.
  - remove `.parseStream` in favor of `transformStream`
  - more stable auto generated typescript definitions.

## Installation
In browser you load it how ever you want. For example as tag: <script src="dist/txml.min.js"></script>.

In node and browserify, run **"npm install txml"** in your project
and then in your script you require it by `const txml = require('txml');` or in typescript `import * as txml from 'txml';`.

For specially small builds using modern module bundlers like rollup or webpack you can import `txml/txml` or `txml/dist/txml`. This will not add the transformStream into the bundle and with that exclude the Node.js files.

## Methods

### **txml.parse** *(xmlString, options)*
1. **xmlString** is the XML to parse.
2. **options** is optional 
    - **searchId** an ID of some object. that can be queried. Using this is incredible fast. 
    - **filter** a method, to filter for interesting nodes, use it like Array.filter.
    - **simplify** to simplify the object, to an easier access.
    - **pos** where to start parsing.
    - **keepComments** if you want to keep comments in your data (kept as string including `<!-- -->`) (default false)
    - **keepWhitespace** keep whitespace like spaces, tabs and line breaks as string content (default false)
    - **noChildNodes** array of nodes, that have no children and don't need to be closed. Default is working good for html. For example when parsing rss, the link tag is used to really provide an URL that the user can open. In html however a link text is used to bind css or other resource into the document. In HTML it does not need to get closed. so by default the noChildNodes contains the tagName 'link'. Same as 'img', 'br', 'input', 'meta', 'link'. That means: when parsing rss, it makes to set `noChildNodes` to [], an empty array.
```js
txml.parse(`<user is='great'>
    <name>Tobias</name>
    <familyName>Nickel</familyName>
    <profession>Software Developer</profession>
    <location>Shanghai / China</location>
</user>`);
// will return an object like: 
[{
    "tagName": "user",
    "attributes": {
        "is": "great"
    },
    "children": [{
            "tagName": "name",
            "attributes": {},
            "children": [ "Tobias" ]
        }, {
            "tagName": "familyName",
            "attributes": {},
            "children": [ "Nickel" ]
        }, {
            "tagName": "profession",
            "attributes": {},
            "children": [ "Software Developer" ]
        }, {
            "tagName": "location",
            "attributes": {},
            "children": [ "Shanghai / China" ]
        }
    ]
}];  
```  

### **txml.simplify** *(tXml_DOM_Object)* 
Same purpose of simplify, to make the data easier accessible. It is modeled after PHP
s [simplexml](https://www.php.net/manual/en/function.simplexml-load-string). You can quickly access properties. However, some attributes might be lost. Also some string values can be lost. For details see [Issue 19](https://github.com/TobiasNickel/tXml/issues/19).
This method is used with the `simplify` parsing option.
1. **tXml_DOM_Object** the object to simplify.
```js
txml.simplify(txml.parse(`<user is='great'>
    <name>Tobias</name>
    <familyName>Nickel</familyName>
    <profession>Software Developer</profession>
    <location>Shanghai / China</location>
</user>`));
// will return an object like: 
{
    "user": {
        "name": "Tobias",
        "familyName": "Nickel",
        "profession": "Software Developer",
        "location": "Shanghai / China",
        "_attributes": {
            "is": "great"
        }
    }
}
```

### **txml.simplifyLostLess** *(tXml_DOM_Object)* 
This version is not the same as in PHP simple_xml. But therefor, you do not lose any information. If there are attributes, you get an _attribute property, even if there is only one of a kind, it will be an array with one item, for consistent code.

### **txml.filter** *(tXml_DOM_Object, f)* 
This method is used with the filter parameter, it is used like Array.filter. But it will traverse the entire deep tree.
1. **tXml_DOM_Object** the object to filter.
2. **f** a function that returns true if you want this elements in the result set.
```js
const dom = txml.parse(`
<html>
    <head>
        <style>
            p { color: "red" }
        </style>
    </head>
    <body>
        <p>hello</p>
    </body>
</html>`);
const styleElement = data.filter(dom, node=>node.tagName.toLowerCase() === 'style')[0];
```

### **txml.getElementById** (xml, id) 
To find an element by ID. If you are only interested for the information on, a specific node, this is easy and fast, because not the entire xml text need to get parsed, but only the small section you are interested in.
1. **xml** the xml string to search in.
2. **id** the id of the element to find
**returns** return one node

### **txml.getElementsByClassName** (xml, className) 
Find the elements with the given class, without parsing the entire xml into a tDOM. So it is very fast and convenient. returns a list of elements. 
1. **xml** the xml string to search in.
2. **className** the className of the element to find

### **txml.transformStream** (offset, parseOptions?)
1. offset optional you to set short before the first item.
    usually files begin with something like "<!DOCTYPE osm><osm>"
    so the offset need to be before the first item starts so that 
    between that item and the offset is no "<" character.
    alternatively, pass a string, containing this preamble.
2. options optional, similar to the parse methods options.
return transformStream.
```js
const xmlStream = fs.createReadStream('your.xml')
  .pipe(txml.transformStream());
for await(let element of xmlStream) {
  // your logic here ...
}
```
The transform stream is great, because when your logic within the processing loop is slow, the file read stream will also run slower, and not fill up the RAM memory. For a more detailed explanation read [here](https://tnickel.de/2019/10/15/2019-10-for-async-on-nodejs-streams/)

## Changelog
 - version 5.1.0
   - export ./* in package.json to allow older bundlers to import sub path directly.
   ` import { parse } from 'txml/dist/txml.mjs'; `
 - version 5.0.1
   - fix simplify empty objects (issue #24)
 - version 5.0.0
   - improved handling of whitespace (issue #21)
   - automated build with rollup (PR #23)
 - version 4.0.1
   - fixed children type definition not to include number (issue #20)
   - add `hr` to self closing tags
   - new parser option `keepWhitespace` (issue #21)

## Developer

![Tobias Nickel](https://avatars1.githubusercontent.com/u/4189801?s=150)

[Tobias Nickel](https://tnickel.de/) German software developer in Shanghai. 

