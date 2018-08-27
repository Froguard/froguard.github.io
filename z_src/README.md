# 说明

## 日常

#### 准备

```
cd z_src
npm i
cd themes/yilia
npm i
```

#### 本地调试:

````
npm run dev
````

#### 发布:
````
// 发布文章
npm run push
// 完全同步
npm run sync
````

## 补充


#### 目录说明


##### .deplo_git

用以将文章提交到git上的


#### public 

生成的博客系统文件夹目录


#### scaffold

顾名思义,脚手架:用以在新建post(文章),page(页面),draft(草稿)时候调用的模板

````
hexo new post "xxx文章标题"
// 会去调用 scaffold/post.md文件,然后基于该文件位模板,新创建一文章
````

同理:

````
hexo new xxx "xxx标题" 
会去找scaffold/post.md文件,然后基于该文件位模板,在source/的相应位置,新创建一个xxx标题.md
````


#### source

写作目录:存放博客写作的文章,页面,草稿等等


#### theme

博客主题文件夹

theme/xxx/source/下是源码,其中有可以供访问的脚本,如果想要加入自己的脚本,放文件放到这里即可

然后在html中以
```html
<script src="/js/src/funny/json-toy/jsonToy.min.js"></script>
```
访问,比如我的叫"funny/json-toy/jsonToy.min.js"


