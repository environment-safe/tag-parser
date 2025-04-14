/* global describe:false */
import { chai } from '@environment-safe/chai';
import { it } from '@open-automaton/moka';
import { HTMLParser, TemplateParser, Template } from '../src/index.mjs';
const should = chai.should();

describe('module', ()=>{
    describe('performs a simple test suite', ()=>{
        it('loads', async ()=>{
            should.exist({});
        });
        
        it('parses some HTML', async ()=>{
            const parser = new HTMLParser();
            var parsed = parser.parse('<html><head><title>skjd</title></head><body onload="awesome()"><h1>fdsdf</h1><p>sjdnjsnd</p><!--a comment--></body></html>');
            var html = parsed.children[0];
            html.name.should.equal('html');
            html.type.should.equal('tag');
            var head = html.children[0];
            head.name.should.equal('head');
            head.type.should.equal('tag');
            var title = head.children[0];
            title.name.should.equal('title');
            title.type.should.equal('tag');
            title.children[0].should.equal('skjd');
            var body = html.children[1];
            body.name.should.equal('body');
            body.type.should.equal('tag');
            body.attributes.onload.should.equal('awesome()');
            var h1 = body.children[0];
            h1.name.should.equal('h1');
            h1.type.should.equal('tag');
            h1.children[0].should.equal('fdsdf');
            var p = body.children[1];
            p.name.should.equal('p');
            p.type.should.equal('tag');
            p.children[0].should.equal('sjdnjsnd');
            var comment = body.children[2];
            comment.text.should.equal('a comment');
            comment.type.should.equal('comment');
        });
    });
    
    describe('performs a simple test suite', ()=>{
        
        it('parses and render template', async ()=>{
            const template = new Template('skdhasdjvvyeub ${foo} ds;dkf;d${bar}fhfh$ ${baz}kjs');
            const rendered = template.render({
                foo: 'AAA',
                bar: 'BBB',
                baz: 'CCC'
            });
            rendered.should.equal('skdhasdjvvyeub AAA ds;dkf;dBBBfhfh$ CCC');
        });
    });
});

