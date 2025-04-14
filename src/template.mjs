import { SimpleParser } from './simple.mjs';
import * as string from 'strangler';
//import { ExtendedEmitter } from '@environment-safe/event-emitter';

const contains = (arr, item)=>{
    return arr.indexOf(item) !== -1;
};

export class TemplateParser extends SimpleParser{
    constructor(){
        super([
            {
                name : 'variable',
                sentinels : [['${', '}']],
                onParse : (tag, parser)=>{
                    if(this.text){
                        pushChild(this.tagStack[this.tagStack.length-1], this.text);
                    }
                    pushChild(this.tagStack[this.tagStack.length-1], tag);
                    this.text = '';
                }
            }
        ]);
        this.attributeDelimiters = ['"'];
    }
}

function pushChild(parent, child){
    if(!parent.children) parent.children = [];
    parent.children.push(child);
}

export class Template{
    static parser = new TemplateParser();
    constructor(text){
        this.parsed = Template.parser.parse(text);
    }
    render(context){
        const kids = this.parsed[0].children;
        return kids.map((item)=>{
            if(typeof item ==='string') return item;
            if(item.type === 'variable'){
                return context[item.text.toLowerCase()];
            }
        }).join('');
    }
}