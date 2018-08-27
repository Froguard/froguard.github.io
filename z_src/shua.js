window.wf = {};
var max = 3;
var i = 0;
function doAdd(){
	var name = "test"+(i);
    var s = window.wf["_"+name] = document.createElement("script");
	s.id = name;
	document.body.appendChild(s);
    s.src = "//dn-lbstatics.qbox.me/busuanzi/2.3/busuanzi.pure.mini.js";
    if(i >= max){
    	var pID = "test" + (i - max);
		var past = document.getElementById(pID);
		past && past.remove && past.remove() && console.log("delete child #"+pID);
		if(!!window.wf["_"+pID]){
			delete window.wf["_"+pID];	
		}
    }
    i++;
}
function timer(c,h,m){
	var _c = c || 1000;
	var _h = h || 1;
	var _m = m || 0;
	var msTimeLimit = (_h * 60 + _m ) * 60 * 1000; 
	var step = parseInt(msTimeLimit/_c);
	console.warn("⭐️在"+_h+"小时"+_m+"分内，刷"+_c+"次（每"+parseInt(step/1000)+"s刷一次）");
	var t = window.setInterval(function(){
		if(i<c){
			doAdd();	
		}else{
			window.clearInterval(t);
		}
	},step);
}
timer(10000,8);
