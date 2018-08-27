// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
!function(mod){"object"==typeof exports&&"object"==typeof module?// CommonJS
mod(require("../../lib/codemirror")):"function"==typeof define&&define.amd?// AMD
define(["../../lib/codemirror"],mod):// Plain browser env
mod(CodeMirror)}(function(CodeMirror){"use strict";function wordRegexp(words){return new RegExp("^(("+words.join(")|(")+"))\\b")}function top(state){return state.scopes[state.scopes.length-1]}var wordOperators=wordRegexp(["and","or","not","is"]),commonKeywords=["as","assert","break","class","continue","def","del","elif","else","except","finally","for","from","global","if","import","lambda","pass","raise","return","try","while","with","yield","in"],commonBuiltins=["abs","all","any","bin","bool","bytearray","callable","chr","classmethod","compile","complex","delattr","dict","dir","divmod","enumerate","eval","filter","float","format","frozenset","getattr","globals","hasattr","hash","help","hex","id","input","int","isinstance","issubclass","iter","len","list","locals","map","max","memoryview","min","next","object","oct","open","ord","pow","property","range","repr","reversed","round","set","setattr","slice","sorted","staticmethod","str","sum","super","tuple","type","vars","zip","__import__","NotImplemented","Ellipsis","__debug__"];CodeMirror.registerHelper("hintWords","python",commonKeywords.concat(commonBuiltins)),CodeMirror.defineMode("python",function(conf,parserConf){
// tokenizers
function tokenBase(stream,state){
// Handle scope changes
if(stream.sol()&&(state.indent=stream.indentation()),stream.sol()&&"py"==top(state).type){var scopeOffset=top(state).offset;if(stream.eatSpace()){var lineOffset=stream.indentation();return lineOffset>scopeOffset?pushPyScope(state):lineOffset<scopeOffset&&dedent(stream,state)&&"#"!=stream.peek()&&(state.errorToken=!0),null}var style=tokenBaseInner(stream,state);return scopeOffset>0&&dedent(stream,state)&&(style+=" "+ERRORCLASS),style}return tokenBaseInner(stream,state)}function tokenBaseInner(stream,state){if(stream.eatSpace())return null;
// Handle Comments
if("#"==stream.peek())return stream.skipToEnd(),"comment";
// Handle Number Literals
if(stream.match(/^[0-9\.]/,!1)){var floatLiteral=!1;if(
// Floats
stream.match(/^\d*\.\d+(e[\+\-]?\d+)?/i)&&(floatLiteral=!0),stream.match(/^\d+\.\d*/)&&(floatLiteral=!0),stream.match(/^\.\d+/)&&(floatLiteral=!0),floatLiteral)
// Float literals may be "imaginary"
return stream.eat(/J/i),"number";
// Integers
var intLiteral=!1;if(
// Hex
stream.match(/^0x[0-9a-f]+/i)&&(intLiteral=!0),
// Binary
stream.match(/^0b[01]+/i)&&(intLiteral=!0),
// Octal
stream.match(/^0o[0-7]+/i)&&(intLiteral=!0),
// Decimal
stream.match(/^[1-9]\d*(e[\+\-]?\d+)?/)&&(
// Decimal literals may be "imaginary"
stream.eat(/J/i),
// TODO - Can you have imaginary longs?
intLiteral=!0),
// Zero by itself with no other piece of number.
stream.match(/^0(?![\dx])/i)&&(intLiteral=!0),intLiteral)
// Integer literals may be "long"
return stream.eat(/L/i),"number"}
// Handle Strings
// Handle Strings
// Handle operators and Delimiters
// Handle non-detected items
return stream.match(stringPrefixes)?(state.tokenize=tokenStringFactory(stream.current()),state.tokenize(stream,state)):stream.match(tripleDelimiters)||stream.match(doubleDelimiters)?"punctuation":stream.match(doubleOperators)||stream.match(singleOperators)?"operator":stream.match(singleDelimiters)?"punctuation":"."==state.lastToken&&stream.match(identifiers)?"property":stream.match(keywords)||stream.match(wordOperators)?"keyword":stream.match(builtins)?"builtin":stream.match(/^(self|cls)\b/)?"variable-2":stream.match(identifiers)?"def"==state.lastToken||"class"==state.lastToken?"def":"variable":(stream.next(),ERRORCLASS)}function tokenStringFactory(delimiter){function tokenString(stream,state){for(;!stream.eol();)if(stream.eatWhile(/[^'"\\]/),stream.eat("\\")){if(stream.next(),singleline&&stream.eol())return OUTCLASS}else{if(stream.match(delimiter))return state.tokenize=tokenBase,OUTCLASS;stream.eat(/['"]/)}if(singleline){if(parserConf.singleLineStringErrors)return ERRORCLASS;state.tokenize=tokenBase}return OUTCLASS}for(;"rubf".indexOf(delimiter.charAt(0).toLowerCase())>=0;)delimiter=delimiter.substr(1);var singleline=1==delimiter.length,OUTCLASS="string";return tokenString.isString=!0,tokenString}function pushPyScope(state){for(;"py"!=top(state).type;)state.scopes.pop();state.scopes.push({offset:top(state).offset+conf.indentUnit,type:"py",align:null})}function pushBracketScope(stream,state,type){var align=stream.match(/^([\s\[\{\(]|#.*)*$/,!1)?null:stream.column()+1;state.scopes.push({offset:state.indent+hangingIndent,type:type,align:align})}function dedent(stream,state){for(var indented=stream.indentation();state.scopes.length>1&&top(state).offset>indented;){if("py"!=top(state).type)return!0;state.scopes.pop()}return top(state).offset!=indented}function tokenLexer(stream,state){stream.sol()&&(state.beginningOfLine=!0);var style=state.tokenize(stream,state),current=stream.current();
// Handle decorators
if(state.beginningOfLine&&"@"==current)return stream.match(identifiers,!1)?"meta":py3?"operator":ERRORCLASS;/\S/.test(current)&&(state.beginningOfLine=!1),"variable"!=style&&"builtin"!=style||"meta"!=state.lastToken||(style="meta"),
// Handle scope changes.
"pass"!=current&&"return"!=current||(state.dedent+=1),"lambda"==current&&(state.lambda=!0),":"!=current||state.lambda||"py"!=top(state).type||pushPyScope(state);var delimiter_index=1==current.length?"[({".indexOf(current):-1;if(-1!=delimiter_index&&pushBracketScope(stream,state,"])}".slice(delimiter_index,delimiter_index+1)),-1!=(delimiter_index="])}".indexOf(current))){if(top(state).type!=current)return ERRORCLASS;state.indent=state.scopes.pop().offset-hangingIndent}return state.dedent>0&&stream.eol()&&"py"==top(state).type&&(state.scopes.length>1&&state.scopes.pop(),state.dedent-=1),style}var ERRORCLASS="error",singleDelimiters=parserConf.singleDelimiters||/^[\(\)\[\]\{\}@,:`=;\.]/,doubleOperators=parserConf.doubleOperators||/^([!<>]==|<>|<<|>>|\/\/|\*\*)/,doubleDelimiters=parserConf.doubleDelimiters||/^(\+=|\-=|\*=|%=|\/=|&=|\|=|\^=)/,tripleDelimiters=parserConf.tripleDelimiters||/^(\/\/=|>>=|<<=|\*\*=)/,hangingIndent=parserConf.hangingIndent||conf.indentUnit,myKeywords=commonKeywords,myBuiltins=commonBuiltins;void 0!=parserConf.extra_keywords&&(myKeywords=myKeywords.concat(parserConf.extra_keywords)),void 0!=parserConf.extra_builtins&&(myBuiltins=myBuiltins.concat(parserConf.extra_builtins));var py3=!(parserConf.version&&Number(parserConf.version)<3);if(py3){
// since http://legacy.python.org/dev/peps/pep-0465/ @ is also an operator
var singleOperators=parserConf.singleOperators||/^[\+\-\*\/%&|\^~<>!@]/,identifiers=parserConf.identifiers||/^[_A-Za-z\u00A1-\uFFFF][_A-Za-z0-9\u00A1-\uFFFF]*/;myKeywords=myKeywords.concat(["nonlocal","False","True","None","async","await"]),myBuiltins=myBuiltins.concat(["ascii","bytes","exec","print"]);var stringPrefixes=new RegExp("^(([rbuf]|(br))?('{3}|\"{3}|['\"]))","i")}else{var singleOperators=parserConf.singleOperators||/^[\+\-\*\/%&|\^~<>!]/,identifiers=parserConf.identifiers||/^[_A-Za-z][_A-Za-z0-9]*/;myKeywords=myKeywords.concat(["exec","print"]),myBuiltins=myBuiltins.concat(["apply","basestring","buffer","cmp","coerce","execfile","file","intern","long","raw_input","reduce","reload","unichr","unicode","xrange","False","True","None"]);var stringPrefixes=new RegExp("^(([rub]|(ur)|(br))?('{3}|\"{3}|['\"]))","i")}var keywords=wordRegexp(myKeywords),builtins=wordRegexp(myBuiltins);return{startState:function(basecolumn){return{tokenize:tokenBase,scopes:[{offset:basecolumn||0,type:"py",align:null}],indent:basecolumn||0,lastToken:null,lambda:!1,dedent:0}},token:function(stream,state){var addErr=state.errorToken;addErr&&(state.errorToken=!1);var style=tokenLexer(stream,state);return style&&"comment"!=style&&(state.lastToken="keyword"==style||"punctuation"==style?stream.current():style),"punctuation"==style&&(style=null),stream.eol()&&state.lambda&&(state.lambda=!1),addErr?style+" "+ERRORCLASS:style},indent:function(state,textAfter){if(state.tokenize!=tokenBase)return state.tokenize.isString?CodeMirror.Pass:0;var scope=top(state),closing=scope.type==textAfter.charAt(0);return null!=scope.align?scope.align-(closing?1:0):scope.offset-(closing?hangingIndent:0)},electricInput:/^\s*[\}\]\)]$/,closeBrackets:{triples:"'\""},lineComment:"#",fold:"indent"}}),CodeMirror.defineMIME("text/x-python","python");CodeMirror.defineMIME("text/x-cython",{name:"python",extra_keywords:function(str){return str.split(" ")}("by cdef cimport cpdef ctypedef enum exceptextern gil include nogil property publicreadonly struct union DEF IF ELIF ELSE")})});