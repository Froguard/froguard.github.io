// generate the main.css file
require('../css/main.scss');

require('./jquery');
var tags = require('./tags');
var archiveInner = require('./archive-inner');
var tools = require('./tools');
var browser = require('./browser');
// 定义到全局上
window.browser = $.extend(true,window.browser || {},browser);
var fixPage = require('./fix-page');
var mobile = require('./mobile');
var viewer = require('./viewer');
var go2top = require('./go2top');
var catalog = require('./catalog');
require('./jquery.lazyload');
// init
$(function() {
	viewer.init();
	archiveInner.init();
	fixPage.init();
	tags.init();
  go2top.init();
  catalog.init();
  // todo: resize desktop
	if(browser.versions.mobile === true && $(window).width() < 800){
		mobile.init();
	}else{
		tools.init();
    $('.js-smart-menu').click(function(e) {
			e.stopPropagation();
			tools.show($(this).data('idx'));
		});
		$('.left-col,.mid-col').click(function() {
			tools.hide();
		});
  }
  //修复markdown文档中a标签无法加上 target="_blank" 的缺陷
	if (yiliaConfig && yiliaConfig.open_in_new) {
		$('.article-entry a').not('[href^=#]').not('.article-more-a').attr('target', '_blank');
	}
});

/*
var jsCookie = require('js-cookie');
require('badjs-report');
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return null;
}
// 统计用，开发者不需要理会
if (window.BJ_REPORT) {
  BJ_REPORT.init({
    id: 1
  });
  BJ_REPORT.init({
    id: 1,
    uin: window.location.origin,
    combo: 0,
    delay: 1000,
    url: "//litten.me:9005/badjs/",
    ignore: [/Script error/i],
    random: 1,
    repeat: 500000,
    onReport: function(id, errObj){},
    ext: {}
  });
  // iframe不上报
  var host = window.location.host
  var isNotFrame = (top === window)
  var isNotLocal = !((/localhost/i.test(host) || /127.0.0.1/i.test(host) || /0.0.0.0/i.test(host)))
  isNotFrame && isNotLocal && BJ_REPORT.report('yilia-' + window.location.host)
  // 来源上报
  var from = getQueryString('f');
  var fromKey = 'yilia-from';
  if (from) {
    isNotFrame && BJ_REPORT.report('from-' + from);
    // 种cookie
    jsCookie.set(fromKey, from);
  } else {
    if (document.referrer.indexOf(window.location.host) >= 0) {
      // 取cookie
      from = jsCookie.get(fromKey);
      from && isNotFrame && BJ_REPORT.report('from-' + from);
    } else {
      // 清cookie
      jsCookie.remove(fromKey);
    }
  }
}
*/

