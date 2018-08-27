---
title: 常用css代码段收集，基于mcss书写
tags:
  - css
  - mcss
date: 2016-11-30 15:35:16
categories: f2e
comments: false
mathjax: true
share: false
---

收集一些常用的css代码片段，并通过mcss书写记录下来。想要查看css代码的，可以选择直接

<!--more-->

> 利用伪类法居中元素

想要居中一个元素，方法很多，其中，绝对定位加上margin负边距(负的二分之一高 -$ \frac 1 2h$)，或者css3transform的translateY(-50%),这里介绍一种不同于这两种方法的实现

特点：适用于 .outer > .inner，.inner水平垂直都居中，且当内部div的内容变化导致尺寸变化的时候，依旧保持“居中”特性

兼容性: 加上通过可兼容到IE6

限制：

1. 需要预设父容器.outer的高度
2. 子元素.inner的宽高最大不可超过父元素.outer

```less
$centerify^=($outerName,$innerName=div,$outerWidth,$outerHeight=1000px){
  // 外层容器
  $outerName?="&";
  #{$outerName}{
  text-align: center;
  display: block;
  @if $outerWidth!=null{
    width: $outerWidth;
  }
  height: $outerHeight;// 这里需要预设父容器的高度
  	// 内部需要居中的元素
    > #{$innerName}{
      display: inline-block;
      // *display:inline;*zoom:1;
      vertical-align: middle;
      max-height: 99%;
      max-width: 99%;
      height: auto;
      width: auto;
      white-space: normal;
      text-indent: 0;
    }
    // & > .before, & > .after,
    &:before, &:after{
      display: inline-block;
      // *display:inline;*zoom:1;
      width: 0;
      height: 100%;
      vertical-align: middle;
      content: '';
    }
  }
}
.demo1{  $centerify(null,div,null,1000px); }
//$centerify(".demo2",".demo2-inner",null,300px);

```

↓↓↓

```css
.demo1{
  text-align:center;
  display:block;
  height:1000px;
}
.demo1 >div{
  display:inline-block;
  vertical-align:middle;
  max-height:99%;
  max-width:99%;
  height:auto;
  width:auto;
  white-space:normal;
  text-indent:0;
}
.demo1:before,.demo1:after{
  display:inline-block;
  width:0;
  height:100%;
  vertical-align:middle;
  content:"";
}
```

[Have a try](https://froguard.github.io/funny/mcssOnline.html?clear=1)

对于ie7等不支持伪类的浏览器，请手动加上 .before,.after 实体节点，效果一致，不支持inline-block的还需要加上 *display:inline;*zoom:1

> 简单型雪碧图

假如有一堆尺寸一样大的图标，且都同一具有两个状态normal和hover（在同一张图中左到右排列，行一normal，行二hover）那么批量生成可以使用如下代码

```less
$sprite^=($classPreName="icon-",$imgUrl,$width=36px,$height,$iconNames){
  $height?=$width;
  #{'[class*=" ' + $classPreName + '"]'},
  #{'[class^="' + $classPreName + '"]'}{
    background: transparent url(#{$imgUrl}) 0 0 no-repeat;
   	display: inline;
    width: $width;
    height: $height;
    line-height: $height;
    vertical-align: middle;
  };
  $convertZero=($n){@if($n==0px){ @return 0; }@else{ @return $n;}}
  @for $item,$i of $iconNames{
    .#{$classPreName}#{$item}{
		background-position: $convertZero(- $i * $width) 0;
        &:hover{
          background-position: $convertZero(- $i * $width) $convertZero(- $height);
        }
    }
  }
}

$iconNames=(earth,chart,book,user);//图标名称数组

$sprite(icon-,"images/icons.png",30px,30px,$iconNames);
```

↓↓↓

```css
[class*=" icon-"],[class^="icon-"]{
  background:transparent url("images/icons.png") 0 0 no-repeat;
  display:inline;
  width:30px;
  height:30px;
  line-height:30px;
  vertical-align:middle;
}
.icon-earth{background-position:0 0;}
.icon-earth:hover{background-position:0 -30px;}
.icon-chart{background-position:-30px 0;}
.icon-chart:hover{background-position:-30px -30px;}
.icon-book{background-position:-60px 0;}
.icon-book:hover{background-position:-60px -30px;}
.icon-user{background-position:-90px 0;}
.icon-user:hover{background-position:-90px -30px;}
```

[Have a try](https://froguard.github.io/funny/mcssOnline.html?clear=1)