/*
import { isBrowser, isJsDom } from 'browser-or-node';
import * as mod from 'module';
import * as path from 'path';
let internalRequire = null;
if(typeof require !== 'undefined') internalRequire = require;
const ensureRequire = ()=> (!internalRequire) && (internalRequire = mod.createRequire(import.meta.url));
//*/

/**
 * A JSON object
 * @typedef { object } JSON
*/

import { SimpleParser } from './simple.mjs';
import { TagParser } from './tag.mjs';
import { HTMLParser } from './html.mjs';
import { TemplateParser, Template } from './template.mjs';

export { SimpleParser, TagParser, HTMLParser, TemplateParser, Template };
//import { ExtendedEmitter } from '@environment-safe/event-emitter';
