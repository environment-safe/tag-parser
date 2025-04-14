"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TemplateParser = exports.Template = void 0;
var _simple = require("./simple.cjs");
class TemplateParser extends _simple.SimpleParser {
  constructor() {
    super([{
      name: 'variable',
      sentinels: [['${', '}']],
      onParse: (tag, parser) => {
        if (this.text) {
          pushChild(this.tagStack[this.tagStack.length - 1], this.text);
        }
        pushChild(this.tagStack[this.tagStack.length - 1], tag);
        this.text = '';
      }
    }]);
    this.attributeDelimiters = ['"'];
  }
}
exports.TemplateParser = TemplateParser;
function pushChild(parent, child) {
  if (!parent.children) parent.children = [];
  parent.children.push(child);
}
class Template {
  static parser = new TemplateParser();
  constructor(text) {
    this.parsed = Template.parser.parse(text);
  }
  render(context) {
    const kids = this.parsed[0].children;
    return kids.map(item => {
      if (typeof item === 'string') return item;
      if (item.type === 'variable') {
        return context[item.text.toLowerCase()];
      }
    }).join('');
  }
}
exports.Template = Template;