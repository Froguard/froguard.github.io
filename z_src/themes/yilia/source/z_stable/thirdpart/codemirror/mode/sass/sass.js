// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
!function(mod){"object"==typeof exports&&"object"==typeof module?// CommonJS
mod(require("../../lib/codemirror")):"function"==typeof define&&define.amd?// AMD
define(["../../lib/codemirror"],mod):// Plain browser env
mod(CodeMirror)}(function(CodeMirror){"use strict";CodeMirror.defineMode("sass",function(config){function urlTokens(stream,state){var ch=stream.peek();return")"===ch?(stream.next(),state.tokenizer=tokenBase,"operator"):"("===ch?(stream.next(),stream.eatSpace(),"operator"):"'"===ch||'"'===ch?(state.tokenizer=buildStringTokenizer(stream.next()),"string"):(state.tokenizer=buildStringTokenizer(")",!1),"string")}function comment(indentation,multiLine){return function(stream,state){return stream.sol()&&stream.indentation()<=indentation?(state.tokenizer=tokenBase,tokenBase(stream,state)):(multiLine&&stream.skipTo("*/")?(stream.next(),stream.next(),state.tokenizer=tokenBase):stream.skipToEnd(),"comment")}}function buildStringTokenizer(quote,greedy){function stringTokenizer(stream,state){var nextChar=stream.next(),peekChar=stream.peek(),previousChar=stream.string.charAt(stream.pos-2);return"\\"!==nextChar&&peekChar===quote||nextChar===quote&&"\\"!==previousChar?(nextChar!==quote&&greedy&&stream.next(),state.tokenizer=tokenBase,"string"):"#"===nextChar&&"{"===peekChar?(state.tokenizer=buildInterpolationTokenizer(stringTokenizer),stream.next(),"operator"):"string"}return null==greedy&&(greedy=!0),stringTokenizer}function buildInterpolationTokenizer(currentTokenizer){return function(stream,state){return"}"===stream.peek()?(stream.next(),state.tokenizer=currentTokenizer,"operator"):tokenBase(stream,state)}}function indent(state){if(0==state.indentCount){state.indentCount++;var lastScopeOffset=state.scopes[0].offset,currentOffset=lastScopeOffset+config.indentUnit;state.scopes.unshift({offset:currentOffset})}}function dedent(state){1!=state.scopes.length&&state.scopes.shift()}function tokenBase(stream,state){var ch=stream.peek();
// Comment
if(stream.match("/*"))return state.tokenizer=comment(stream.indentation(),!0),state.tokenizer(stream,state);if(stream.match("//"))return state.tokenizer=comment(stream.indentation(),!1),state.tokenizer(stream,state);
// Interpolation
if(stream.match("#{"))return state.tokenizer=buildInterpolationTokenizer(tokenBase),"operator";
// Strings
if('"'===ch||"'"===ch)return stream.next(),state.tokenizer=buildStringTokenizer(ch),"string";if(state.cursorHalf){if("#"===ch&&(stream.next(),stream.match(/[0-9a-fA-F]{6}|[0-9a-fA-F]{3}/)))return stream.peek()||(state.cursorHalf=0),"number";
// Numbers
if(stream.match(/^-?[0-9\.]+/))return stream.peek()||(state.cursorHalf=0),"number";
// Units
if(stream.match(/^(px|em|in)\b/))return stream.peek()||(state.cursorHalf=0),"unit";if(stream.match(keywordsRegexp))return stream.peek()||(state.cursorHalf=0),"keyword";if(stream.match(/^url/)&&"("===stream.peek())return state.tokenizer=urlTokens,stream.peek()||(state.cursorHalf=0),"atom";
// Variables
if("$"===ch)return stream.next(),stream.eatWhile(/[\w-]/),stream.peek()||(state.cursorHalf=0),"variable-3";
// bang character for !important, !default, etc.
if("!"===ch)return stream.next(),stream.peek()||(state.cursorHalf=0),stream.match(/^[\w]+/)?"keyword":"operator";if(stream.match(opRegexp))return stream.peek()||(state.cursorHalf=0),"operator";
// attributes
if(stream.eatWhile(/[\w-]/))return stream.peek()||(state.cursorHalf=0),"attribute";
//stream.eatSpace();
if(!stream.peek())return state.cursorHalf=0,null}else{// state.cursorHalf === 0
// first half i.e. before : for key-value pairs
// including selectors
if("."===ch){if(stream.next(),stream.match(/^[\w-]+/))return indent(state),"atom";if("#"===stream.peek())return indent(state),"atom"}if("#"===ch){
// ID selectors
if(stream.next(),stream.match(/^[\w-]+/))return indent(state),"atom";if("#"===stream.peek())return indent(state),"atom"}
// Variables
if("$"===ch)return stream.next(),stream.eatWhile(/[\w-]/),"variable-2";
// Numbers
if(stream.match(/^-?[0-9\.]+/))return"number";
// Units
if(stream.match(/^(px|em|in)\b/))return"unit";if(stream.match(keywordsRegexp))return"keyword";if(stream.match(/^url/)&&"("===stream.peek())return state.tokenizer=urlTokens,"atom";if("="===ch&&stream.match(/^=[\w-]+/))return indent(state),"meta";if("+"===ch&&stream.match(/^\+[\w-]+/))return"variable-3";
// Indent Directives
if("@"===ch&&stream.match(/@extend/)&&(stream.match(/\s*[\w]/)||dedent(state)),stream.match(/^@(else if|if|media|else|for|each|while|mixin|function)/))return indent(state),"meta";
// Other Directives
if("@"===ch)return stream.next(),stream.eatWhile(/[\w-]/),"meta";if(stream.eatWhile(/[\w-]/))return stream.match(/ *: *[\w-\+\$#!\("']/,!1)?"property":stream.match(/ *:/,!1)?(indent(state),state.cursorHalf=1,"atom"):stream.match(/ *,/,!1)?"atom":(indent(state),"atom");if(":"===ch)return stream.match(pseudoElementsRegexp)?"keyword":(stream.next(),state.cursorHalf=1,"operator")}// else ends here
// else ends here
// If we haven't returned by now, we move 1 character
// and return an error
return stream.match(opRegexp)?"operator":(stream.next(),null)}function tokenLexer(stream,state){stream.sol()&&(state.indentCount=0);var style=state.tokenizer(stream,state),current=stream.current();if("@return"!==current&&"}"!==current||dedent(state),null!==style){for(var startOfToken=stream.pos-current.length,withCurrentIndent=startOfToken+config.indentUnit*state.indentCount,newScopes=[],i=0;i<state.scopes.length;i++){var scope=state.scopes[i];scope.offset<=withCurrentIndent&&newScopes.push(scope)}state.scopes=newScopes}return style}var keywords=["true","false","null","auto"],keywordsRegexp=new RegExp("^"+keywords.join("|")),operators=["\\(","\\)","=",">","<","==",">=","<=","\\+","-","\\!=","/","\\*","%","and","or","not",";","\\{","\\}",":"],opRegexp=function(words){return new RegExp("^"+words.join("|"))}(operators),pseudoElementsRegexp=/^::?[a-zA-Z_][\w\-]*/;return{startState:function(){return{tokenizer:tokenBase,scopes:[{offset:0,type:"sass"}],indentCount:0,cursorHalf:0,// cursor half tells us if cursor lies after (1)
// or before (0) colon (well... more or less)
definedVars:[],definedMixins:[]}},token:function(stream,state){var style=tokenLexer(stream,state);return state.lastToken={style:style,content:stream.current()},style},indent:function(state){return state.scopes[0].offset}}}),CodeMirror.defineMIME("text/x-sass","sass")});