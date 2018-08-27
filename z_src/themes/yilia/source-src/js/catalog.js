/**
 * 文章右侧的 悬浮窗“内容大纲列表”
 * @returns {boolean}
 */
function initCatalog(){
  // 移动端不处理
  if(window.browser && window.browser.versions && window.browser.versions.mobile){
    return false;
  }
  // 只处理post
  var noneCatalog = !yiliaConfig || !yiliaConfig.catalog
                      || !yiliaConfig.page || yiliaConfig.page.isHome  || !yiliaConfig.page.isPost;
  if(noneCatalog){ return false; }
  var $ = window.jQuery || window.$ || window.jquery || false;
  if(!$){
    console.warn("undefined the 'jquery',failed to init catalog!");
    return false;
  }
  var $catalog = $("#j-catalog");
  var $entry = $(".body-wrap article.article .article-entry").eq(0);
  if(!$catalog || !$entry){
    console.warn("Can't find the #j-catalog dom or article dom,check it plz!");
    return false;
  }
  // 抓取文章中的h1-6标题,且带有id属性的节点
  var $catalogPar = $catalog.parent().hide();
  var domStr = [];
  var $hdArr = $entry.find("h1[id],h2[id],h3[id],h4[id],h5[id],h6[id]");
  if(!$hdArr.length){
    return false;
  }
  // create & insert
  $hdArr.each(function(i,ele){
    var tag = (""+ele.tagName).toLowerCase().split("h")[1],
        id = ele.id;
    domStr.push("<li class='ci-lv"+tag+"'><p title='"+id+"'><a href='#"+id+"'>"+id+"</a></p></li>");
  });
  domStr = "<ul>"+domStr.join("")+"</ul>";
  $catalog.html(domStr);


  // bind fun
  var initLocked = (window.location.hash === "#locked-catalog")
                    || (yiliaConfig && yiliaConfig.post && yiliaConfig.post.openCatalog==="locked");
  var $nail = $("#j-nail");
  $nail.attr("title",initLocked ? "取消固定" : "点击固定");
  $catalogPar[initLocked ? "addClass" : "removeClass"]("z-locked");

  var _tNC;
  $nail.on("click",function(){
    !!_tNC && window.clearTimeout(_tNC);
    _tNC = window.setTimeout(function(){
      var isChecked = $catalogPar.hasClass("z-locked");
      var action = isChecked ? "removeClass" : "addClass";
      var title = isChecked ?  "点击固定" : "取消固定";
      $nail.attr("title",title);
      $catalogPar[action]("z-locked");
    },0);
  });

  // show
  setTimeout(function(){
    $catalogPar.show();
  },0);

}

module.exports = {
  init: initCatalog
};
