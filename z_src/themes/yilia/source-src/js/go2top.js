function initGo2Top(){
  // 移动端不处理
  if(window.browser && window.browser.versions && window.browser.versions.mobile){
    return false;
  }
  // 只处理post
  if(!yiliaConfig || !yiliaConfig.go2top){
    return false;
  }
  var $ =window.jQuery ||  window.$ || window.jquery || false;
  if(!$){
    console.warn("undefined the 'jquery',failed to init go2top!");
    return false;
  }
  var $jgt = $("#j-go2top");
  var $bd = $(".mid-col:eq(0)");
  var _t ;
  $(window).on("scroll",function(e){
    !!_t && window.clearTimeout(_t);
    _t = window.setTimeout(function(){
      var action = $bd.scrollTop > 200 ? "addClass" : "removeClass";
      $jgt[action]("show");
    },200);
  });
  $jgt.on("click",function(e){
    $jgt.removeClass("show");
    $("html,body").stop().animate({scrollTop:0},300);
  });

}
module.exports = {
  init: initGo2Top
};

