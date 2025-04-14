"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TagParser = void 0;
var _simple = require("./simple.cjs");
var string = _interopRequireWildcard(require("strangler"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
//import { ExtendedEmitter } from '@environment-safe/event-emitter';

const contains = (arr, item) => {
  return arr.indexOf(item) !== -1;
};
class TagParser extends _simple.SimpleParser {
  constructor(environments, onComplete) {
    super(environments, onComplete);
    this.attributeDelimiters = ['"'];
    this.on('parse', node => {
      if (node.type == 'tag') {
        var tag = this.parseTag(node.text);
        Object.keys(tag).forEach(key => {
          node[key] = tag[key];
        });
      }
    });
  }
  parseTag(tag, res) {
    const results = res ? res : {};
    var position = tag.indexOf(' ');
    var name = tag.substring(0, position) || tag;
    var remainder = tag.substring(position);
    var attributes = {};
    if (remainder && position != -1) {
      var attributeStrings = string.splitHonoringQuotes(remainder, ' ', this.attributeDelimiters);
      attributeStrings.forEach(attr => {
        var parts = attr.split('=');
        if (parts.length < 2) return;
        if (contains(this.attributeDelimiters, parts[1][0])) {
          //quoted?
          parts[1] = parts[1].substring(1, parts[1].length - 1);
        }
        attributes[parts[0]] = parts[1];
      });
      results.parts = attributeStrings;
    } else results.parts = [];
    results.name = name;
    results.attributes = attributes;
    return results;
  }
}
exports.TagParser = TagParser;