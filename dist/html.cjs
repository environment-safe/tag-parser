"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HTMLParser = void 0;
var _tag = require("./tag.cjs");
class HTMLParser extends _tag.TagParser {
  constructor() {
    super([{
      name: 'escape',
      sentinels: [['<![CDATA[', ']]>']],
      onParse: (tag, parser) => {
        pushChild(this.tagStack[this.tagStack.length - 1], tag);
      }
    }, {
      name: 'comment',
      sentinels: [['<!--', '-->']],
      onParse: (tag, parser) => {
        pushChild(this.tagStack[this.tagStack.length - 1], tag);
      }
    }, {
      name: 'tag',
      sentinels: [['<', '>']],
      onParse: (tag, parser) => {
        if (tag.name[0] == '/') {
          tag.name = tag.name.substring(1);
          var matched = this.tagStack.pop();
          if (matched.name.toLowerCase() !== tag.name.toLowerCase()) throw 'strict parse error!';
          if (parser.text != '') {
            pushChild(matched, parser.text);
            parser.text = '';
          }
          pushChild(this.tagStack[this.tagStack.length - 1], matched);
        } else {
          this.tagStack.push(tag);
        }
      }
    }]);
    this.targets = {};
    this.strict = true;
  }
  parse(html) {
    this.tagStack = [{}];
    _tag.TagParser.prototype.parse.apply(this, arguments);
    return this.tagStack[0];
  }
}
exports.HTMLParser = HTMLParser;
function pushChild(parent, child) {
  if (!parent.children) parent.children = [];
  parent.children.push(child);
}