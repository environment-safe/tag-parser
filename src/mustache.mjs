import { SimpleParser } from './simple.mjs';

export class MustacheParser extends SimpleParser{
    constructor(){
        super([
            {
                name : 'container-tag',
                sentinels : [['{{#', '}}']],
                onParse : (tag, parser)=>{
                    if(parser.text != ''){
                        pushChild(this.tagStack[this.tagStack.length-1], parser.text);
                        parser.text = '';
                    }
                    this.tagStack.push(tag);
                }
            },
            {
                name : 'close-tag',
                sentinels : [['{{/', '}}']],
                onParse : (tag, parser)=>{
                    var matched = this.tagStack.pop();
                    if(matched.text.toLowerCase() !== tag.text.toLowerCase()) throw('strict parse error!');
                    if(parser.text != ''){
                        pushChild(matched, parser.text);
                        parser.text = '';
                    }
                    pushChild(this.tagStack[this.tagStack.length-1], matched);
                }
            },
            {
                name : 'tag',
                sentinels : [['{{', '}}']],
                onParse : (tag, parser)=>{
                    if(parser.text != ''){
                        pushChild(this.tagStack[this.tagStack.length-1], parser.text);
                        parser.text = '';
                    }
                    pushChild(this.tagStack[this.tagStack.length-1], tag);
                }
            }
        ]);
        this.targets = {};
        this.strict = true;
    }
    
    parse(html){
        this.tagStack = [{}];
        SimpleParser.prototype.parse.apply(this, arguments);
        return this.tagStack[0];
    }
}

function pushChild(parent, child){
    if(!parent.children) parent.children = [];
    parent.children.push(child);
}

export class Mustache{
    static parser = new MustacheParser();
    constructor(text){
        this.parsed = Mustache.parser.parse(text);
    }
    render(context){
        const kids = this.parsed.children;
        return kids.map((item)=>{
            return this.renderNode(item, context[item.text.trim()]);
        }).join('');
    }
    renderNode(node, context){
        if(typeof node ==='string') return node;
        const kids = node.children;
        if(node.type  === 'container-tag'){
            if(Array.isArray(context)){
                return context.map((subcontext)=>{
                    return kids.map((item)=>{
                        if(typeof item ==='string') return item;
                        return this.renderNode(item, subcontext);
                    }).join('');
                }).join('');
            }else{
                return kids.map((item)=>{
                    if(typeof item ==='string') return item;
                    return this.renderNode(item, context);
                }).join('');
            }
        }
        
        if(node.type  === 'tag'){
            return context[node.text.trim()];
        }
    }
}