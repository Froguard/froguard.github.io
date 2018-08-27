// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
!function(){"use strict";var mode=CodeMirror.getMode({indentUnit:2},"text/x-gss");!function(name){test.mode(name,mode,Array.prototype.slice.call(arguments,1),"gss")}("atComponent","[def @component] {","[tag foo] {","  [property color]: [keyword black];","}","}")}();