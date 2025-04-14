import { SimpleParser } from './simple.mjs';

export class UBBParser extends SimpleParser{
    constructor(){
        super([
            {
                name : 'tag',
                sentinels : [['[', ']']],
                onParse : (tag, parser)=>{
                    if(tag.type === 'tag' && tag.text[0] == '/'){
                        tag.text = tag.text.substring(1);
                        var matched = this.tagStack.pop();
                        if(parser.text != ''){
                            pushChild(matched, parser.text);
                            parser.text = '';
                        }
                        if(matched.text.toLowerCase() !== tag.text.toLowerCase()){
                            if(
                                matched.text.toLowerCase() === '*' &&
                                this.tagStack[this.tagStack.length-1].text && 
                                this.tagStack[this.tagStack.length-1].text === 'list'
                            ){
                                const t = this.tagStack.pop();
                                pushChild(t, matched);
                                pushChild(this.tagStack[this.tagStack.length-1], t);
                            }else throw('strict parse error!');
                        }else{
                            pushChild(this.tagStack[this.tagStack.length-1], matched);
                        }
                    }else{
                        //this case covers all middle cases but not open or close
                        //*
                        if(tag.text === '*'){
                            if(
                                this.tagStack[this.tagStack.length-1].text && 
                                this.tagStack[this.tagStack.length-1].text === '*'
                            ){
                                pushChild(this.tagStack[this.tagStack.length-1], parser.text);
                                parser.text = '';
                                const tag = this.tagStack.pop();
                                pushChild(this.tagStack[this.tagStack.length-1], tag);
                            }
                        } //*/
                        this.tagStack.push(tag);
                    }
                }
            }
        ]);
        this.targets = {};
        this.strict = true;
    }
}

function pushChild(parent, child){
    if(!parent.children) parent.children = [];
    parent.children.push(child);
}

export class UBB{
    static parser = new UBBParser();
    constructor(text){
        this.parsed = UBB.parser.parse(text);
    }
    render(context){
        const kids = this.parsed[0].children;
        return kids.map((item)=>{
            return this.renderNode(item);
        }).join('');
    }
    renderOpen(node){
        switch(node.text){
            case 'b' : 
            case 'i' :
            case 'code' :
            case 'quote' :
                return `<${node.text}>`;
            case '*' : return '<li>';
            case 'url' : return '<a href="">';
            case 'email' : return '<a href="email:">';
            case 'list' : return '<ul>';
        }
    }
    renderClose(node){
        switch(node.text){
            case 'b' : 
            case 'i' :
            case 'code' :
            case 'quote' :
                return `</${node.text}>`;
            case '*' : return '</li>';
            case 'url' : return '</a>';
            case 'email' : return '</a>';
            case 'list' : return '</ul>';
        }
    }
    renderNode(node){
        if(typeof node ==='string') return node;
        const kids = node.children;
        return this.renderOpen(node)+kids.map((item)=>{
            return this.renderNode(item);
        }).join('')+this.renderClose(node);
    }
}