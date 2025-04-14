import { SimpleParser } from './simple.mjs';
import * as string from 'strangler';
//import { ExtendedEmitter } from '@environment-safe/event-emitter';

const contains = (arr, item)=>{
    return arr.indexOf(item) !== -1;
};

export class TagParser extends SimpleParser{
    constructor(environments, onComplete){
        super(environments, onComplete);
        this.attributeDelimiters = ['"'];
        this.on('parse', (node)=>{
            if(node.type == 'tag'){
                var tag = this.parseTag(node.text);
                Object.keys(tag).forEach((key)=>{
                    node[key] = tag[key];
                });
            }
        });
    }
    parseTag(tag, res){
        const results = res?res:{};
        var position = tag.indexOf(' ');
        var name = tag.substring(0, position) || tag;
        var remainder = tag.substring(position);
        var attributes = {};
        if(remainder && position != -1){
            var attributeStrings = string.splitHonoringQuotes(remainder, ' ', this.attributeDelimiters);
            attributeStrings.forEach((attr)=>{
                var parts = attr.split('=');
                if(parts.length < 2) return;
                if(contains(this.attributeDelimiters, parts[1][0])){ //quoted?
                    parts[1] = parts[1].substring(1, parts[1].length-1);
                }
                attributes[parts[0]] = parts[1];
            });
            results.parts = attributeStrings;
        }else results.parts = [];
        results.name = name;
        results.attributes = attributes;
        return results;
    }
    
}