title: Mcss快速指引
date: 2016-11-08
category: 
- f2e
- note
tag:
- css
- mcss
- css预处理器
- note
catalog: locked

---

这是一篇简单短小的关于mcss快速指引的介绍，尽量以最简单的例子进行梳理，供学习参考作用。

<!--more-->

mcss是开发者[leeluolee](https://github.com/leeluolee/)开发的一款非常优秀的[css预处理器](https://segmentfault.com/q/1010000002527156/a-1020000002527759)，名气不如less响。但功能丝毫不逊色于其他预处理器。具体介绍这里不再赘述，有兴趣的去看[官网](https://github.com/leeluolee/mcss)。下面进入正题：

下面的样例，均可以在线编辑器里面查看效果：[McssOnlineParser](https://froguard.github.io/funny/mcssOnline "在线解析mcss")

# 概要

- [语法](#语法)
  - [注释](#注释)
  - [变量](#变量)
    - [变量的三种赋值方式](#变量的三种赋值方式)
  - [数据类型](#数据类型)
    - [常规类型](#常规类型)
    - [特殊类型](#特殊类型)
      - [index函数获取valueslist或values中元素的值](#index函数获取valueslist或values中元素的值)
  - [嵌套](#嵌套)
    - [&符号,获取上层引用](#使用-amp-符号获取上层引用)
    - [%符号,获取上层列表引用](#使用-符号获取上除最外层选择器之外的层序列)
      - [%符号使用注意点](#百分符号使用注意点)
  - [运算](#运算)
    - [支持的运算符](#支持的运算)
    - [注意点(或者叫坑)](#mcss运算的注意点)
  - [逻辑](#逻辑)
  - [循环](#循环)
    - [简单型遍历 @for of](#简单型遍历for-of)
      - [常规遍历](#常规遍历)
      - [循环中的索引值](#循环中的索引值)
    - [Map型遍历 @for in](#Map型遍历for-in)
  - [函数](#函数)
    - [定义&使用](#函数的定义&使用)
      - [mixin模式的函数](#mixin模式的函数)
      - [函数模式的函数](#函数模式的函数)
    - [函数的args,$arguments](#函数的参数)
    - [内建函数](#内建函数)
  - [域](#域)
  - [继承](#继承)
    - [@extend](#extend)
  - [导入](#导入)
    - [@import](#import)
    - [@abstract](#abstract)
    - [@abstract-block](#abstract-block)
  - [@debug](#debug)
- [库](#库)

# 语法

## 注释
mcss支持的常规的注释 //,/\*\*/,/\*\*\*/这几种注释

## 变量

mcss变量声明以符号 $为起始，赋值方式三种：=, ^= , ?=

```less
// 定义&赋值
$colorDark = #333;
// 使用
a{ color:$colorDark; }
```

```css
a{ color: #333; }
```

### 变量的三种赋值方式

三个符号差异：

- =  常规变量赋值
- ^= 全局变量赋值（mcss有scope的概念，这个后面讲）
- ?= 空变量赋值（仅在变量为‘未赋值’或‘null’时候生效）

## 数据类型
Mcss的数据类型除开常规的几种（string,function,boolean,null）之外，
还包含css中的一些常规类型（color,dimension,text,values,valuesList）

### 常规类型
- string : $fontName='微软雅黑';等
- color : #000,#7563fd,rgb(255,255,255),rgba(0,0,0,0.1),hls(238,251,102),hlsa(238,251,102,0.1)这几种
- dimension : 尺寸，如10px,15pt,20rem,50%等等
- text : 文本变量，有别于string

如：

```less
$dir = left; //a text var
.demo{
  float: $dir;
}
```
↓↓↓
```css
.demo{float: left;}
```

### 特殊类型

- values : 对应css中的组合值，如border:1px solid #ddd;里的1px solid #ddd就是一个values类型
- boolean : true | false，编程需要
- null : 空，编程需要
- valuesList : 对应一些多值的组合，一般用逗号(,)隔开，类似于数组(array)。如$arr = (1,2,3,4,5);
  数组元素不受限制，可用于map等其他类似数据结构；如$map = (left 10px, top 20px, color #09c);
  数组支持 begin...end 这种简写写法；
  valuesList主要用于编程需要。
- function: 详见 [函数](#函数)

#### index函数获取valueslist或values中元素的值

valueslist，或values类型的数据可以通过 index(list,n)来获取 list\[n\]

```less
$list = 1px 2em 3pt;
$list2 = 1px, 2em 2pt, 3%;
p{
  left: index($list, 0);
  right: index($list2, 1);
}
```

↓↓↓

```css
p{
  left:1px;
  right:2em 2pt;
}
```



> mcss没有undefined这类型一说，空的就是null

## 嵌套

作为一个css预处理器最基本也是最常见的功能，mcss支持嵌套

```less
.farther {
  font-size: 40px;
  .son {
    font-size: 20px;
    .grand-son {
      font-size: 10px;
    }
  }
}
```
↓↓↓
```css
.farther{font-size:40px;}
.farther .son{font-size:20px;}
.farther .son .grand-son{font-size:10px;}
```

### 使用&amp;符号获取上层引用

```less
a{
  font-size: 12px;
  &:hover{ color: #09c; }
  &:active{ color: #aaa; }
}
```
↓↓↓
```css
a{font-size:12px;}
a:hover{color:#09c;}
a:active{color:#aaa;}
```

这里mcss支持的选择器写法与原生css一致，+,&gt;,~，不专属于mcss的范畴，这里就不再赘述

### 使用%符号获取上除最外层选择器之外的层序列

**此属性在可读性和使用逻辑上来说，有一定成本，所以，嫌麻烦的同学（比如我）可以跳过%符号的使用**

对于一些具有共同样式属性的选择器，我们在写css的时候，一般会倾向于书写如下的代码
例如实现 .a, .b, .c 在不同容器包围时候的显示隐藏：
```css
.normal-con .a,
.normal-con .b,
.normal-con .c{
  display: block;
}
.hide-con .a,
.hide-con .b,
.hide-con .c{
  display: none;
}
```
如果序列不算多，例如本例为 a~c，书写起来还算好,但是一旦选择器序列多起来，那么如此写法不仅累，而且难以维护.
这时，我们可以采用%符号来尝试去解决这个问题

```less
.normal-con{
  .a, .b, .c{// 序列(.a, .b, .c)
    display: block;
    .hide-con %{
      display: none;
    }
  }
}
```

将会输出与上面一样的代码效果，但代码的‘简洁性’，‘可维护性’以及‘优雅性’，都比上面的好

#### 百分符号使用注意点

- **除开最外层**

  输出仅仅只与其最外层的选择器无关，如果内层有其他层级嵌套的选择器出现，照样输出。比如，下面我们在normal里面再加一层.mid选择器
  ```less
  .normal-con{
    .mid{
      .a, .b, .c{// 序列(.a, .b, .c)
        display: block;
        .hide-con %{
          display: none;
        }
      }
    }
  }
  ```

  ↓↓↓

  ```css
  .normal-con .mid .a,.normal-con .mid .b,.normal-con .mid .c{
    display:block;
  }
  .hide-con  .mid .a,.hide-con  .mid .b,.hide-con  .mid .c{
    display:none;
  }
  ```

  效果看上去就像:

  > **"将%左边的部分(.hide-con)，替换最外层的选择器(.normal-con)，而其他层级(如本例中的.mid层级)，一切照旧"**


- **序列**

  里需要说明的是，%符号指代的序列，是指代(.a,.b,.c)这个序列，而序列值，仅仅只有一个，也是允许的，此时，%有点像是“特殊的父引用”

  ```less
  .normal-con{
    .a{
      display: block;
      .hide-con %{
        display: none;
      }
    }
  }
  ```

  ↓↓↓

  ```css
  .normal-con .a{
    display:block;
  }
  .hide-con  .a{
    display:none;
  }
  ```

## 运算

### mcss支持的运算

- 一元运算符: -,!,+
- 二元运算符: +,-,*,/,%
- 逻辑运算符: ||,&&
- 关系运算符: ==,>=,<=,>,<,!=
- 括号: (,)

优先级与javascript完全一致，运算结果与js有一点差异

```less
.demo{//这里css的property名写得比较随意，着重点在于value
// simple + -
    add1: 10 + 20;      //30
    add2: 10px + 20px;  //30px
    add3: 10pt + 20;    //30px
    add4: 10 + 20em;    //30em
    add5: 10 + 'px';    //"10px" → string
    add6: 10 + px;      //10px
    add7: px + 10;      //px10
    add8: 'px' + 10;    //"px10" → string
    add9: 'px' + hello; //"pxhello" → string
    add10: hello+'px';  //"hellopx" → string
    add11: hello+px;    //hellopx
    add12: 'hello'+px;  //"hellopx" → string
// simple * / %
    mult1: 10*10;       //100
    mult2: 10px*10;     //100px
    mult3: 10*10pt;     //100pt
    mult4: 10pt*10px;   //100pt → be careful!
// simpe ||  &&  logic
    or1: 0 || 1;           //1
    or2: 0 || '' || true;  //true
    and1: 0px && 1;        //0px  → be careful!
    and2: 1 && 2 && false; // false
    andor: 0 || 1 && 2;    //2
// simpe unary - !
    $num = 1;
    neg: -$num;    //-1
    reverse: !$num;//false
// relation
    gt: 10>5;    //true
    lt: 9<6;     //false
    ge1: 9>=8;   //true
    le1: 9<=10;  //true
    le1: 9>=10;  //false
    eq1: 9==9;   //true
    nq1: 9!=9;   //false
    nq2: 9!='9'; //true  → be careful!
// expression
    exp1: (10 + 9) * 10;       //190
    exp2: 10 + 9 * 10;         //100
    exp3: ('' || 10px) + 20px; //30px  → be careful!
}
```

### mcss运算的注意点

**注意点：需要进行二元运算时候，符号两边最好保留空格，不然有可能原样连接输出**

原因：css中，值里面是可以出现-,/,%字符的，所以为了区分是值，还是计算表达式，最好两边加上空格以表示是计算

```less
.demo{
    // beacuse css support neg number
    // so - operator should have WS after it
    sub1: 10 - 20;      //-10
    sub2: 10px - 20px;  //-10px
    sub3: 10pt - 20;    //-10pt
    sub4: 10 - 20em;    //-10em
    sub5: 10 -20;       //10 -20   → be careful
    sub6: 10px -20px;   //10px -20px  → be careful
    sub7: 10pt -20;     //10pt -20 → be careful
    sub8: 10 -20em;     // 10 -20em
    // the '/' operation at least has one WS around it
    // beacuse font: 14px/2   is valid in css;
    div1: 10/10;       //10/10 → be careful
    div2: 10px/10;     //10px/10 → be careful
    div3: 10/10pt;     //10pt/10 → be careful
    div4: 10pt/10px;   //10pt/10 → be careful
    div1: 10 / 10;     //1
    div2: 10px/ 10;    //1px
    div3: 10 / 10pt;   //1pt
    div4: 10pt /10px;  //1pt
    // if a number literal, remenber to insert a WS before % to avoid be tokenized as a percent
    remain: 21 %6;      //3
    remain: 21%6;       //21%6
    remain: 21px%6;     //3px
    remain: 21 %6px;    //3px
    remain: 21%6px;     //21% 6px
    remain: 21px%6pt;   //3px
}
```

## 逻辑

@if, @elseif, @else

```less
$screenWidth = 1200px;
h3{
    font-weight: bold;
    @if $screenWidth>1200px {
        font-size: 20px;
    }@elseif (960px <= $screenWidth && $screenWidth <= 1200px){
    //此处括号可省略，为了可读性，建议保留
        font-size: 16px;
    }@else{
        font-size: 12px;
    }
}
```
↓↓↓
```css
h1{font-size:16px;}
```

## 插值

interpolate插值语法与scss一致，#{$变量名}

```less
$status = z-checked;
.u-checkbox{
  //...
  background-position: 0 0;
  &.#{$status} {// 相当于 &.z-checked {
    background-position: 0 -16px;
  }
}
```
↓↓↓
```css
.u-checkbox{
  background-position:0 0;
}
.u-checkbox.z-checked{
  background-position:0 -16px;
}
```

‘插值’操作像上面单独使用的情况不会太多，因为这种情况下作用跟直接使用变量名区别不大，而一般在函数中，逻辑，循环等中进行组合使用比较多。
这里还需要有一个概念，‘插值’并不仅是做文本替换，这里操作的是变量，即：变量的值，不仅为Text，还可以为其他的，比如下面例子中会出现的valueslist

## 循环

mcss的循环关键字只有一个@for，但循环功能并不单一，自由组合书写能够完成类似while，each等常见操作。
mcss的循环主要分为两种：

- @for of
- @for in

语法：

```js
@for item:VAR[, index:VAR]? ['by' step:expression]? [('of'|'in') valueslist] block
```


### 简单型遍历for-of

#### 常规遍历

配合插值使用时：

```less
$arr = (one,two,three);// a array
@for $item of $arr{
  .class-#{$item} {
    color: red;
  }
}
```
↓↓↓
```css
.class-one{color:#000;}
.class-two{color:#000;}
.class-three{color:#000;}
```

这里输出没有做选择器合并，可以考虑使用postCss等css后处理器做后续处理，这里不赘述

#### 循环中的索引值
```less
$arr = (one,two,three);// a array
@for $item,$i of $arr{
  .class-#{$item} {
    width: 10px * $i;
  }
}
```
↓↓↓
```css
.class-one{  width: 0px;}
.class-two{  width: 10px;}
.class-three{ width: 20px;}
```

循环可以用过 by 关键字进行index相关设置，比如实现逆序遍历

```less
$arr = (one,two,three);// a array
@for $item,$i by -1 of $arr{
  .class-#{$item} {
    width: 10px * $i;
  }
}
```
↓↓↓
```css
.class-one{  width: 20px;}
.class-two{  width: 10px;}
.class-three{ width: 0px;}
```

### Map型遍历for-in

@for-in用于遍历map型的数据，其中map行数据格式定义如下

```javascript
$map = (k1 v1,k2 v2...,kN vN);//括号可省略，为了可读性，建议保留
```

这里，key值(k1~kN)是允许重复的，不具备唯一性，重复也不会覆盖，即，数据并非一个严格意义上的hashMap！

```less
$propMap = (left 10px, left 20px, left 30px, top 30px, width 40px);
.demo{
  @for $v, $k in $propMap {// $v→value, $k→key
    #{$k} : $v;
  }
}
```

↓↓↓

```css
.demo{
  left:10px;
  left:20px;//重复
  left:30px;//重复
  top:30px;
  width:40px;
}
```


## 函数
css预处理器的一个重要属性，“封装”，而封装的实现，大多数离不开函数（以及mixin），mcss里的函数与js类似，也作为一种数据类型存在

### 函数的定义及使用

#### mixin模式的函数
以实现一个多前缀补全的user-select属性为例

```less
$user-select = ($v){
  -webkit-user-select: $v;
     -moz-user-select: $v;
      -ms-user-select: $v;
          user-select: $v;
}
.txt{
   $user-select(none);  //写法一：函数调用式写法
   //$user-select: none;//写法二：css调用式（transparent call）写法
}
```

↓↓↓

```css
.txt{
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
}
```

#### 函数模式的函数

以实现rem适配移动端为例：

```less
$remRatio ?= 100; // 假设所有分辨率下，固定转换比率为 1rem = 100px
/**
 * @param{Number} $px
 */
$px2rem = ($px){
   @return  ( $px / $remRatio ) + rem;
}

.demo{
  width: $px2rem(36);//假设视觉稿上.demo元素宽度为100px
}
```

↓↓↓

```css
.demo{width: 0.36rem;}
```

### 函数的参数
- 函数支持rest param 以及 default param 、named param
- 函数体中，可以使用args(i),以及$arguments关键字去获取参数的值

rest param 以及 default param 、named param:

```less
// 缺省值
$default-param = ($left, $right = 30px ){
    default-param: $right;
}
// named param 一般用在大量default 只需要传入部分参数的情况下
$named-param = ($color = 30px, $named){
    named: $named;
}

$rest-at-middle = ($left, $middle... , $right){
    rest-at-middle: $middle;
}
$rest-at-left = ($left... , $right){
    rest-at-left: $left;
}
$rest-at-right = ($left,$right...){
    rest-at-right: $right;
}

body{
    $named-param($named = 30px);
    $default-param(10px);
    $rest-at-middle(1, 2, 3, 4);
    $rest-at-left(1, 2, 3, 4);
    $rest-at-right(1, 2, 3, 4);
}
```

↓↓↓

```css
body{
  named:30px;
  default-param:30px;
  rest-at-middle:2,3;
  rest-at-left:1,2,3;
  rest-at-right:2,3,4;
}
```

args(i),$arguments:

```less
$foo = {//函数的声明式括号参数($args...)可以省略
  first: args(0);
  seconed: args(1);
  arguments: $arguments
}
body{
    $foo: 10px, 20px
}
```

### 内建函数

mcss提供了比较丰富的[内建函数](https://github.com/leeluolee/mcss#bif)，如颜色，列表，定义，js，data-uri，error等等

## 域

**非重点，可跳过**

mcss的函数与js类似，会保留当前的作用域

```less
$pos = ($position, $top, $left){
    @if len($arguments) == 1{
        // 返回函数
        @return ($top, $left){
            $pos($position, $top, $left);
        }
    }
    position: $position;
    left: $left;
    top: $top;
}

$relative = $pos(relative);
$fixed = $pos(fixed);
$absolute = $pos(absolute);

body{
    $absolute(10px, 20px);
    // ==   $pos(relative, 10px, 20px);
}
```

↓↓↓

```css
body{
  position:absolute;
  left:20px;
  top:10px;
}
```

## 继承

与其他预处理器一样，mcss也有“继承”功能，用于复用一些公共样式属性，避免过多的类名声明

### extend

采用关键字 @extend 进行样式之间的继承,如下

```less
.demo1{
  color: blue;
}
.demo1 > div{//这里为了能够说明清晰，写法上没有把div嵌套仅.demo1，实际上写的时候可以嵌套
    color: red;
}
.demo2{
    @extend .demo1;
}
.demo2 > div{
    @extend .demo1 > div;//这里需要写全，比如光写div是不对的
}
```

↓↓↓

```css
.demo1, .demo2{
  color:#00f;
}
.demo1 > div, .demo2 > div{
  color:#f00;
}
```

## 导入
mcss的import支持原生css导入，mcss导入，同时，对于循环引用，mcss会给出错误提示

### import

与其他css预处理器一样，mcss允许导入，其中，@import 后面可以使\*.mcss文件，也可以是 \*.css文件
如果是\*.css文件时，不做修改，原样输出

文件目录
```
 ./
  │
  ├─ base.css
  │
  ├─ var.mcss
  │
  └─ main.mcss
```

base.css

```css
.base{color:red;}/*这里是base.mcss中的内容*/
```

var.mcss

```less
$color1 = #09c;
```

main.mcss

```less
@import './base.css';
@import './var.mcss';
.main{color: $color1;}//使用var.mcss中的变量$color1
```

↓↓↓

```css
.base{color:red;}/*这里是base.mcss中的内容*/
.main{color: #09c;}
```

### abstract

使用，但不输出

对于一些想要extend的内容，但不确定会用到，或者说一些纯是公共复用代码块的，不希望想@import那样，全部都输出，则可以用@abstract虚拟引入
比如上面的例子，如果var.mcss里面有定义一个.demo1样式，而main.mcss中想要继承

var.mcss

```less
.demo1{
  font-size:20px;
}
```

main.mcss

```less
//继承.demo1,但是不希望.demo也输出

@abstract './var.mcss';
.hello{
  @extend .demo1;
}
```

↓↓↓

```css
.hello{
  font-size:20px;
}
```

可以看出，虽然main.mcss引入了var.mcss，但是var.mcss中的.demo选择器并未输出。

> **正确使用@abstract, 可避免不需要的冗余样式输出**

#### abstract-block

除了以文件形式出现的内容被@abstract引入之外，显示用@abstract{/\*代码...\*/}的方式声明的代码块，也会起到‘虚拟导入’
的效果，不过限于文件形式的组织方式会比较方面维护以及复用上也好很多，一般建议以 @abstract 'path'的方式。

**可跳过**

比如，使用@abstract-block的方式，改写上面的main.mcss,会得到相同的效果

main.mcss

```less
@abstract {
  .demo1{
    font-size: 20px;
  }
}
.hello{
  @extend .demo1;
}
```

## debug

**可跳过**

如果是在控制台，想要确定表达式的正确性，做一些测试之类的，可以采用@debug expression;的方式在控制台输出表达式的值

当然，由于大部分的表达式都可以在线编辑解析，所以建议使用在线转换器 [mcss-Online-Parse](https://froguard.github.io/funny/mcssOnline.html)


# 库

[Mass](https://github.com/leeluolee/mass)之于mcss，就好比[compass](https://github.com/Compass/compass)之于sass，它是官方css预处理器函数库，里面预定义了很多常用的函数，比如最常见的css3的prefix

详见mcss官方库[Mass](https://github.com/leeluolee/mass)

# 后记

- css预处理器的作用，在前端工程化中还是比较重要的一环，可以省去很多不必要的‘劳力操作’
  比如，移动端的rem方式适配：js监控分辨率，控制根节点font-size，配合css预处理器实现视觉稿上px到rem的单位转换，省去程序员的计算，减少劳力劳动的同时，保障精确性。

- 篇幅所限，只能讲些基础的东西，关于一些高级操作，比如define函数，一些常用的mixin的用法，后面另开一篇文章说明

- css预处理器写得合理，函数库健全的话，理论上是可以完全摆脱css后置处理器的（例如postCss的autoPrefix），当然，这里不是说后置处理器不好，而是说过多得的处理，会使得工程化变慢。
  比如，在webpack中，同一种资源的loader过多的时候，大内容文件的处理，会变得异常慢，一次pack会让你等到花儿都谢了，谢了又开了。
