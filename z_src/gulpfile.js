/*
 * 辅助 npm-scripts
 */
'use strict';
const gulp = require('gulp');
const clean = require('gulp-clean');//清空
const del = require('del');//删除
const colors = require('colors');
const moment = require('moment');
const readYaml = require('read-yaml');
const miniJs = require('gulp-uglify');
const miniCss = require('gulp-clean-css');
const sequence = require('gulp-sequence');
const gaze = require('gaze');
const path = require('path');
// 格式化输出时候的时间前缀
function curTime(){
    return `[${colors.grey(moment().format('HH:mm:ss'))}] `;
}
// 通知
let notifier = require('node-notifier');
function doNotify(title, message, sound, isError) {
    notifier.notify({
        title: title || '提示',
        message: message || '提示内容',
        sound: sound || false,
        icon: `./z_res/source/images/${!!isError?'error.png':'correct.png'}`
    }, (err) => {
        err && console.error(err);
    });
}
// 通过_config.yml文件配置,获取当前主题名,方便后面找寻主题文件夹
let config = readYaml.sync('./_config.yml');
let themeName = config.theme || 'landscape';


// 删除db.json
gulp.task('delDBJson', () => gulp.src('db.json')
        .pipe(clean({force: true}))
        .on('error', (err) => {
            doNotify('删除失败!', '文件"db.json"', 0, 1);
            console.error(curTime()+colors.red.bold(`删除文件"db.json"失败!${err||''}`));
        })
        .on('end', () => {
            console.log(curTime()+colors.magenta.bold('文件"db.json"已删除!'));
        }));
// 删除文件夹 .deploy_git
gulp.task('delDeployGitDir', () => del(['.deploy_git'])
        .then(
            () => {
                console.log(curTime()+colors.magenta.bold('文件夹".deploy_git/"已删除!'));
            },
            (err) => {
                doNotify('删除失败!', '文件夹".deploy_git/"', 0, 1);
                console.error(curTime()+colors.red.bold(`删除文件夹".deploy_git/"失败!${err||''}`));
            }
        ));
// 删除文件夹 public
gulp.task('delPublicDir', () => del(['public'])
        .then(
            () => {
                console.log(curTime()+colors.magenta.bold('文件夹"public/"已删除!'));
            },
            (err) => {
                doNotify('删除失败!', '文件夹"public/"', 0, 1);
                console.error(curTime()+colors.red.bold(`删除文件夹"public/"失败!${err||''}`));
            }
        ));
//任务合并串行执行
gulp.task('cleanDeployCache', sequence('delDBJson', 'delDeployGitDir', 'delPublicDir'));


// 将z_res文件夹之下的所有文件拷贝覆盖到 theme文件夹之下的各个对应文件中
let orginDir = './z_res',
    destDir = `./themes/${themeName}`,
    excludeTargets = `${orginDir}/**/node_modules/**/*.*`;
// 拷贝全部:请先执行,因为后面的js和css的任务,不一定针对所有js和css,比如已经压缩过的(*.min.(js|css))就不处理了,这种文件会漏掉
let ECL_ARR_ALL = [`!${excludeTargets}`];//需要排除的
function cpAll(srcArr, cb){
    srcArr = srcArr || [];
    ECL_ARR_ALL.forEach((it) => {
        srcArr.push(it);
    });
    return gulp.src(srcArr)
        .pipe(gulp.dest(destDir))
        .on('error', (e) => {
            console.dir(e);
        })
        .on('end', () => {
            console.log(curTime()+colors.magenta.bold('同步DIY资源文件\'./z_res/**/*.*\'成功!'));
            typeof cb === 'function' && cb();
        });
}
gulp.task('copyAllZres', () => 
    //这里不能设置排除掉所以js和css，因为有些min文件是需要不仅过压缩直接拷贝的
     cpAll([`${orginDir}/**/*.*`])
);

// js:先压缩,再拷贝,不会处理*.min.js
let ELC_ARR_JS = [
    `!${orginDir}/source/thirdpart/**/*.js`,
    `!${orginDir}/source/static/**/*.js`,
    `!${orginDir}/**/*.min.js`,
    `!${excludeTargets}`
];
function cpJs(srcArr, cb){
    srcArr = srcArr || [];
    ELC_ARR_JS.forEach((it) => {
        srcArr.push(it);
    });
    return gulp.src(srcArr)
        .pipe(miniJs({
            mangle: false, //是否混淆变量名
            preserveComments: 'all' //保留所有注释
            // mangle: {except: ['require' ,'exports' ,'module' ,'$']}//排除混淆关键字
        }))
        .on('error', (e) => {
            console.log(colors.red(`Error:miniAndCopyJs出错...\n${JSON.stringify(e, null, 2)}`));
            doNotify('Error', 'miniAndCopyJs出错...', 1, 1);
            // this.emit('end');
        })
        .pipe(gulp.dest(destDir))
        .on('end', () => {
            console.log(curTime()+colors.magenta.bold('压缩js文件\'./z_res/**/*.js(不含*.min.js)\'成功!'));
            typeof cb === 'function' && cb();
        });
}
gulp.task('miniAndCopyJs', () => cpJs([`${orginDir}/**/*.js`]));

// css:先压缩,再拷贝,不会处理*.min.css
let ECL_ARR_CSS = [
    `!${orginDir}/**/*.min.css`,
    `!${excludeTargets}`
];
function cpCss(srcArr, cb) {
    srcArr = srcArr || [];
    ECL_ARR_CSS.forEach((it) => {
        srcArr.push(it);
    });
    return gulp.src(srcArr)
        .pipe(miniCss({
            advanced: false, //是否开启高级优化（合并选择器等）
            compatibility: 'ie7', //*-ie9+
            keepBreaks: false, //是否保留换行
            keepSpecialComments: '*'//保留所有特殊前缀 类似-webkit-这种
        }))
        .on('error', (e) => {
            console.log(colors.red(`Error:miniAndCopyCss出错...\n${JSON.stringify(e, null, 2)}`));
            doNotify('Error', 'miniAndCopyCss出错...', 1, 1);
        })
        .pipe(gulp.dest(destDir))
        .on('end', () => {
            console.log(curTime()+colors.magenta.bold('压缩css文件\'./z_res/**/*.css(不含*.min.css)\'成功!'));
            typeof cb === 'function' && cb();
        });
}
gulp.task('miniAndCopyCss', () => cpCss([`${orginDir}/**/*.css`]));

// 拷贝任务串行组合执行
gulp.task('copyMyRes2ThemeDir', sequence('copyAllZres', 'miniAndCopyJs', 'miniAndCopyCss'));


// watcher:开发模式之下的动态监听,实时拷贝
function copyDone(title, message){
    global._tCopyAllZres = !!global._tCopyAllZres ? (new Date().getTime() - global._tCopyAllZres) : 1000;
    let msg = global._tCopyAllZres > 1000 ?
                (`${(global._tCopyAllZres/1000).toFixed(2)}s`)
                    : (`${global._tCopyAllZres}ms`);
    doNotify(
        title || '同步DIY资源成功！',
        message || (`It takes ${msg}`)
    );
}
gulp.task('zResCopyGaze', () => {
    console.log(curTime() + colors.green('Start Watcher copyMyRes2ThemeDir'));
    const srcArr = [
        `${orginDir}/**/*.*`,
        `!${excludeTargets}`
    ];
    gaze(srcArr, function(err, watcher) {// eslint-disable-line
        this.on('all', (event, filePath) => {
            filePath = `./${path.relative(__dirname, filePath)}`;
            // console.log(filePath + " is " + event + " !");
            global._tCopyAllZres = new Date().getTime();
            let tar;
            if('changed' === event){
                if(filePath.match(/(\.js)$/) && !filePath.match(/(\.min\.js)$/)){
                    tar = `${orginDir}/**/*.js`;
                    cpJs([tar], copyDone);
                }else if(filePath.match(/(\.css)$/) && !filePath.match(/(\.min\.css)$/)){
                    tar = `${orginDir}/**/*.css`;
                    cpCss([tar], copyDone);
                }else{
                    let ext;
                    if(filePath.match(/(\.min\.css)$/)){
                        ext = '.min.css';
                    }else if(filePath.match(/(\.min\.js)$/)){
                        ext = '.min.js';
                    }else{
                        ext = path.extname(filePath);
                    }
                    tar = `${orginDir}/**/*${ext}`;
                    cpAll([tar], copyDone);
                }
            }else if('deleted'===event){
                tar = path.join(destDir, path.relative(orginDir, filePath));
                console.log(tar);
                try{
                    del.sync(tar);
                    console.log(curTime()+colors.magenta.bold(`${tar} 删除成功!`));
                    copyDone('资源删除成功!', `目标:${tar}`);
                }catch(e1){
                    console.warn(curTime()+colors.red.bold(`${tar}删除失败!:\r\n${e1}`));
                    doNotify('删除失败!', `目标:${tar}`, 0, 1);
                }
            }else{// others
                console.log(`${curTime()}Do nothing when: ${filePath} is ${event} !`);
            }
        });
    });
});