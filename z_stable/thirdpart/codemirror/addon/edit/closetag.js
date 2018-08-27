// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
/**
 * Tag-closer extension for CodeMirror.
 *
 * This extension adds an "autoCloseTags" option that can be set to
 * either true to get the default behavior, or an object to further
 * configure its behavior.
 *
 * These are supported options:
 *
 * `whenClosing` (default true)
 *   Whether to autoclose when the '/' of a closing tag is typed.
 * `whenOpening` (default true)
 *   Whether to autoclose the tag when the final '>' of an opening
 *   tag is typed.
 * `dontCloseTags` (default is empty tags for HTML, none for XML)
 *   An array of tag names that should not be autoclosed.
 * `indentTags` (default is block tags for HTML, none for XML)
 *   An array of tag names that should, when opened, cause a
 *   blank line to be added inside the tag, and the blank line and
 *   closing line to be indented.
 *
 * See demos/closetag.html for a usage example.
 */
!function(mod){"object"==typeof exports&&"object"==typeof module?// CommonJS
mod(require("../../lib/codemirror"),require("../fold/xml-fold")):"function"==typeof define&&define.amd?// AMD
define(["../../lib/codemirror","../fold/xml-fold"],mod):// Plain browser env
mod(CodeMirror)}(function(CodeMirror){function autoCloseGT(cm){if(cm.getOption("disableInput"))return CodeMirror.Pass;for(var ranges=cm.listSelections(),replacements=[],i=0;i<ranges.length;i++){if(!ranges[i].empty())return CodeMirror.Pass;var pos=ranges[i].head,tok=cm.getTokenAt(pos),inner=CodeMirror.innerMode(cm.getMode(),tok.state),state=inner.state;if("xml"!=inner.mode.name||!state.tagName)return CodeMirror.Pass;var opt=cm.getOption("autoCloseTags"),html="html"==inner.mode.configuration,dontCloseTags="object"==typeof opt&&opt.dontCloseTags||html&&htmlDontClose,indentTags="object"==typeof opt&&opt.indentTags||html&&htmlIndent,tagName=state.tagName;tok.end>pos.ch&&(tagName=tagName.slice(0,tagName.length-tok.end+pos.ch));var lowerTagName=tagName.toLowerCase();
// Don't process the '>' at the end of an end-tag or self-closing tag
if(!tagName||"string"==tok.type&&(tok.end!=pos.ch||!/[\"\']/.test(tok.string.charAt(tok.string.length-1))||1==tok.string.length)||"tag"==tok.type&&"closeTag"==state.type||tok.string.indexOf("/")==tok.string.length-1||// match something like <someTagName />
dontCloseTags&&indexOf(dontCloseTags,lowerTagName)>-1||closingTagExists(cm,tagName,pos,state,!0))return CodeMirror.Pass;var indent=indentTags&&indexOf(indentTags,lowerTagName)>-1;replacements[i]={indent:indent,text:">"+(indent?"\n\n":"")+"</"+tagName+">",newPos:indent?CodeMirror.Pos(pos.line+1,0):CodeMirror.Pos(pos.line,pos.ch+1)}}for(var i=ranges.length-1;i>=0;i--){var info=replacements[i];cm.replaceRange(info.text,ranges[i].head,ranges[i].anchor,"+insert");var sel=cm.listSelections().slice(0);sel[i]={head:info.newPos,anchor:info.newPos},cm.setSelections(sel),info.indent&&(cm.indentLine(info.newPos.line,null,!0),cm.indentLine(info.newPos.line+1,null,!0))}}function autoCloseCurrent(cm,typingSlash){for(var ranges=cm.listSelections(),replacements=[],head=typingSlash?"/":"</",i=0;i<ranges.length;i++){if(!ranges[i].empty())return CodeMirror.Pass;var pos=ranges[i].head,tok=cm.getTokenAt(pos),inner=CodeMirror.innerMode(cm.getMode(),tok.state),state=inner.state;if(typingSlash&&("string"==tok.type||"<"!=tok.string.charAt(0)||tok.start!=pos.ch-1))return CodeMirror.Pass;
// Kludge to get around the fact that we are not in XML mode
// when completing in JS/CSS snippet in htmlmixed mode. Does not
// work for other XML embedded languages (there is no general
// way to go from a mixed mode to its current XML state).
var replacement;if("xml"!=inner.mode.name)if("htmlmixed"==cm.getMode().name&&"javascript"==inner.mode.name)replacement=head+"script";else{if("htmlmixed"!=cm.getMode().name||"css"!=inner.mode.name)return CodeMirror.Pass;replacement=head+"style"}else{if(!state.context||!state.context.tagName||closingTagExists(cm,state.context.tagName,pos,state))return CodeMirror.Pass;replacement=head+state.context.tagName}">"!=cm.getLine(pos.line).charAt(tok.end)&&(replacement+=">"),replacements[i]=replacement}cm.replaceSelections(replacements),ranges=cm.listSelections();for(var i=0;i<ranges.length;i++)(i==ranges.length-1||ranges[i].head.line<ranges[i+1].head.line)&&cm.indentLine(ranges[i].head.line)}function autoCloseSlash(cm){return cm.getOption("disableInput")?CodeMirror.Pass:autoCloseCurrent(cm,!0)}function indexOf(collection,elt){if(collection.indexOf)return collection.indexOf(elt);for(var i=0,e=collection.length;i<e;++i)if(collection[i]==elt)return i;return-1}
// If xml-fold is loaded, we use its functionality to try and verify
// whether a given tag is actually unclosed.
function closingTagExists(cm,tagName,pos,state,newTag){if(!CodeMirror.scanForClosingTag)return!1;var end=Math.min(cm.lastLine()+1,pos.line+500),nextClose=CodeMirror.scanForClosingTag(cm,pos,null,end);if(!nextClose||nextClose.tag!=tagName)return!1;
// If the immediate wrapping context contains onCx instances of
// the same tag, a closing tag only exists if there are at least
// that many closing tags of that type following.
for(var cx=state.context,onCx=newTag?1:0;cx&&cx.tagName==tagName;cx=cx.prev)++onCx;pos=nextClose.to;for(var i=1;i<onCx;i++){var next=CodeMirror.scanForClosingTag(cm,pos,null,end);if(!next||next.tag!=tagName)return!1;pos=next.to}return!0}CodeMirror.defineOption("autoCloseTags",!1,function(cm,val,old){if(old!=CodeMirror.Init&&old&&cm.removeKeyMap("autoCloseTags"),val){var map={name:"autoCloseTags"};("object"!=typeof val||val.whenClosing)&&(map["'/'"]=function(cm){return autoCloseSlash(cm)}),("object"!=typeof val||val.whenOpening)&&(map["'>'"]=function(cm){return autoCloseGT(cm)}),cm.addKeyMap(map)}});var htmlDontClose=["area","base","br","col","command","embed","hr","img","input","keygen","link","meta","param","source","track","wbr"],htmlIndent=["applet","blockquote","body","button","div","dl","fieldset","form","frameset","h1","h2","h3","h4","h5","h6","head","html","iframe","layer","legend","object","ol","p","select","table","ul"];CodeMirror.commands.closeTag=function(cm){return autoCloseCurrent(cm)}});