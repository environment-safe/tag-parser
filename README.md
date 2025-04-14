@environment-safe/tag-parser
============================
A buildless ESM module for parsing text markup. Successor to [tag-parser](https://www.npmjs.com/package/tag-parser) and [midas](https://web.archive.org/web/20130212142459/https://mootools.net/forge/p/midas)

TagParser
---------
First include the module:

```js
import { TagParser } from '@environment-safe/tag-parser';
```

then, instantiate the object:

```js
const parser = new TagParser([environments]);
```
    
where environments may contain:

1. *name* : 
2. *sentinels* : a list of the following mixed types:
    1. an array of 2 strings, the first being the 'open' sentinel, the second, 'close'.
    2. an object containing 'opener' && 'closer'
    3. a single string that is both the opener and closer
3. *onParse* : a callback allowing you to make custom modifications of an existing tag

parse with:

```js
const parseTree = parser.parse(text);
```

HTMLParser
----------
First include the module:

```js
const HTMLParser = require('tag-parser/html');
```
    
then, instantiate the object:

```js
const parser = new HTMLParser();
```
    
parse with:

```js
const parseTree = parser.parse('<html><head><title>Awesome!</title></head><body onload="callReady()"><h1>Congrats</h1><p>It worked.</p><!--a comment--></body></html>');
```    

which will produce:
    
```js
{
    type: 'tag',
    text: 'html',
    name: 'html',
    attributes: {},
    children: [
        {
            type: 'tag',
            text: 'head',
            name: 'head',
            attributes: {},
            children: [
                {
                    type: 'tag',
                    text: 'title',
                    name: 'title',
                    attributes: {},
                    children: [
                        'Awesome!'
                    ]
                }
            ]
        },
        {
            type: 'tag',
            text: 'body onload="callReady()"',
            name: 'body',
            attributes: {
                onload : 'callReady()'
            },
            children: [
                {
                    type: 'tag',
                    text: 'h1',
                    name: 'h1',
                    attributes: {},
                    children: [
                        'Congrats!'
                    ]
                },
                {
                    type: 'tag',
                    text: 'p',
                    name: 'p',
                    attributes: {},
                    children: [
                        'It worked.'
                    ]
                },
                {
                    type: 'comment',
                    text: 'a comment',
                    children: [
                        'a comment'
                    ]
                }
            ]
        }
    ]
}
```

TemplateParser
--------------
TBD

Testing
-------

Run the es module tests to test the root modules
```bash
npm run import-test
```
to run the same test inside the browser:

```bash
npm run browser-test
```
to run the same test headless in chrome:
```bash
npm run headless-browser-test
```

to run the same test inside docker:
```bash
npm run container-test
```

Run the commonjs tests against the `/dist` commonjs source (generated with the `build-commonjs` target).
```bash
npm run require-test
```

Development
-----------
All work is done in the .mjs files and will be transpiled on commit to commonjs and tested.

If the above tests pass, then attempt a commit which will generate .d.ts files alongside the `src` files and commonjs classes in `dist`

