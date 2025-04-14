import { TagParser } from './tag.mjs';

export class HTMLParser extends TagParser{
    constructor(){
        super([
            {
                name : 'escape',
                sentinels : [['<![CDATA[', ']]>']],
                onParse : (tag, parser)=>{
                    pushChild(this.tagStack[this.tagStack.length-1], tag);
                }
            },
            {
                name : 'comment',
                sentinels : [['<!--', '-->']],
                onParse : (tag, parser)=>{
                    pushChild(this.tagStack[this.tagStack.length-1], tag);
                }
            },
            {
                name : 'tag',
                sentinels : [['<', '>']],
                onParse : (tag, parser)=>{
                    if(tag.name[0] == '/'){
                        tag.name = tag.name.substring(1);
                        var matched = this.tagStack.pop();
                        if(matched.name.toLowerCase() !== tag.name.toLowerCase()) throw('strict parse error!');
                        if(parser.text != ''){
                            pushChild(matched, parser.text);
                            parser.text = ''
                        }
                        pushChild(this.tagStack[this.tagStack.length-1], matched);
                    }else{
                        this.tagStack.push(tag);
                    }
                }
            }
        ]);
        this.targets = {};
        this.strict = true;
    }
    parse(html){
        this.tagStack = [{}];
        var result = TagParser.prototype.parse.apply(this, arguments);
        return this.tagStack[0];
    }
}

function pushChild(parent, child){
    if(!parent.children) parent.children = [];
    parent.children.push(child);
}