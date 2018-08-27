var webpack = require("webpack");
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WebpackOnBuildPlugin = require('on-build-webpack');
var notifier = require('node-notifier');
function doNotify(title, message, sound, isError) {
  notifier.notify({
    title: title || "提示",
    message: message || "提示内容",
    sound: sound || false,
    icon: "./source/images/" + (!!isError?"error.png":"correct.png")
  }, function (err,response) {
    err && console.error(err);
  });
}

module.exports = {
  entry: {
    main: "./source-src/js/main.js"
  },
  output: {
    path: "./source",
    publicPath: "/",
    filename: "js/[name].min.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,// /(\.jsx|\.js)$/,
        loader: 'babel',//需要babel全家桶：babel-loader babel-core babel-preset-es2015
        query: {
          presets: ['es2015']
        },
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.(scss|sass)$/,
        loader: ExtractTextPlugin.extract('style-loader', ['css-loader?-autoprefixer', 'postcss-loader', 'sass-loader']),
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.json$/,
        loader: 'json',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.html$/,
        loader: 'raw'//'html',这里不用html，因为用html-loader的话会导致解析<>等特殊运算符会被转译成实体代号
      },
      {
        test: /\.(gif|jpg|png|jpeg|bmp|ico)\??.*$/,
        loader: 'url-loader?limit=8192&name=img/[name].[ext]',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.(woff|svg|eot|ttf)\??.*$/,
        loader: "file-loader?name=fonts/[name].[ext]",
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
  postcss: function() {
    return [autoprefixer]; // 后置处理，给已经生成的css加上css3属性前缀
  },
  plugins: [
    new ExtractTextPlugin('css/[name].min.css',{allChunks: true}), // gen *.css
    new webpack.optimize.UglifyJsPlugin({    // compress
      output: {
        comments: false  // remove comments
      },
      compress: {
        warnings: false
      },
      minimize : true,
      except: ['$super', '$', 'exports', 'require']
    }),
    new WebpackOnBuildPlugin(function(stats){
      var compilation = stats.compilation;
      var errors = compilation.errors;
      if (errors.length > 0) {
        var error = errors[0];
        var msg = ":(主题打包出错了orz...";//var msg = error.message;//控制台去看详情吧，太长了不显示
        doNotify(error.name, msg, 'Glass', 1);
      }else {
        var tks = (stats.endTime - stats.startTime);
        tks = tks >= 1000 ? ((tks/1000).toFixed(3) + "s") : (tks+"ms");
        var message = 'takes ' +  tks;
        var warningNumber = compilation.warnings.length;
        if (warningNumber > 0) {
          message += ', with ' + warningNumber + ' warning(s)';
        }
        doNotify('^_^主题打包完成', message);
      }
    })
  ]
};
