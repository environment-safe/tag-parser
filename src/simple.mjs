import { ExtendedEmitter } from '@environment-safe/event-emitter';
import * as string from 'strangler';

function opener(item){
    return item[0] || item.opener || item;
}
function closer(item){
    return item[1] || item.closer || item;
}
function byKey(arr, key){
    var result = {};
    for(let lcv=0; lcv < arr.length; lcv++){
        result[arr[lcv][key]] = arr[lcv];
    }
    return result;
}

export const startsWithAt = function(str, pos, sub){
    return str.indexOf(sub, pos-1) === pos;
}

export class SimpleParser{
    constructor(environments, onComplete){
        this.states = {};
        this.content = {};
        this.text = '';
        this.environments = [];
        (new ExtendedEmitter()).onto(this);
        if(environments) this.setEnvironments(environments);
        if(onComplete){
            this.onComplete = onComplete;
        }else{
            this.ready = new Promise((resolve)=>{
                this.onComplete = resolve;
            });
        }
    }
    setEnvironments(environments){
        this.environments = environments;
        this.environmentsByKey = byKey(this.environments, 'name');
    }
    checkEnvironment(environment, job){
        if(this.states[environment.name]){ //in?
            var cls = closer(this.states[environment.name]);
            if(startsWithAt( job.text, job.lcv, cls )){
                job.lcv += cls.length-1;
                this.states[environment.name] = false;
                var tag = {
                    type : environment.name,
                    text : this.content[environment.name]
                };
                this.emit('parse', tag, this);
                if(environment.onParse) environment.onParse(tag, this);
                this.content[environment.name] = '';
            }else this.content[environment.name] += job.text[job.lcv];
            return true;
        }else{
            if(this.states[environment.name] = this.isTypeAt(job.text, job.lcv, environment.name)){ //beginning?
                this.content[environment.name] = '';
                job.lcv += opener(this.states[environment.name]).length-1;
                return true;
            }
            return false;
        }
    }
    isTypeAt(string, position, type){
        var result;
        this.environmentsByKey[type].sentinels.forEach((sentinel)=>{
            var op = opener(sentinel);
            var cls = closer(sentinel);
            if(result) return;
            if(
                op[0] === string[position] && 
                string.substring(position, position+op.length) == op
            ) result = sentinel;
        });
        return result || false;
    }
    parse(xmlChars){
        var environmentNames = Object.keys(this.environmentsByKey);
        var job = {text: xmlChars};
        this.tagStack = [{name:'root'}];
        for(job.lcv = 0; job.lcv < job.text.length; job.lcv++){
            var handled = false;
            environmentNames.forEach((environmentName)=>{ //todo: switch to real for
                if(handled) return;
                handled = this.checkEnvironment(this.environmentsByKey[environmentName], job);
            });
            if(!handled) this.text += xmlChars[job.lcv];
        }
        if(this.onComplete) this.onComplete.apply(this);
        return this.tagStack;
    }
}