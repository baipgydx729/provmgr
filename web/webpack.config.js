var path = require('path');
var glob = require('glob');
var util = require('util');

var webpack= require('webpack');
var pkg=require("./package.json");

var ExtractTextPlugin = require('extract-text-webpack-plugin'); //提取文本
var HtmlWebpackPlugin = require('html-webpack-plugin'); //生成 html 模板
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin; //丑化
//引入路径
var node_modules = path.resolve(__dirname, 'node_modules');

var server=require("./server.json");

function getEntry(globPath, pathDir) {
    var files = glob.sync(globPath);
    var templates = [],
        entry, dirname, basename, pathname, extname;

    for (var i = 0; i < files.length; i++) {
        entry = files[i];
        dirname = path.dirname(entry);
        extname = path.extname(entry);
        basename = path.basename(entry, extname);
        pathname = path.normalize(path.join(dirname,  basename));
        pathDir = path.normalize(pathDir);
        if(pathname.startsWith(pathDir)){
            pathname = pathname.substring(pathDir.length)
        }
        
        templates.push(pathname);
    }
    return templates;
}

module.exports=function (options) {

    options = options || {};
    var DEBUG = options.debug !==undefined ? options.debug :true;

    //生成路径字符串
    var jsBundle = path.join('js', util.format('[name].%s.js', pkg.version));
    var cssBundle = path.join('css', util.format('[name].%s.css', pkg.version));
    var _path = pkg.config.buildDir;

    var pages = getEntry('generate/*.html', 'generate/');

    //config
    var config = {
        entry: {
            'app': ['avalon2', 'mmRouter', 'jquery', 'jquery-modal', 'jquery-datetimepicker'].concat(['./app/js/app'])
        },
        resolve: {
            extensions: ['', '.js', '.json'],
            alias: {
                'jquery':path.resolve(node_modules,'jquery/dist/jquery.js'),
                'jquery-datetimepicker':path.resolve(node_modules,'jquery-datetimepicker/build/jquery.datetimepicker.full.js'),
                'jquery-modal':path.resolve(node_modules,'jquery-modal/jquery.modal.js'),
                'avalon2':path.resolve(node_modules,'avalon2/dist/avalon.js'),
                'mmRouter':path.resolve(node_modules,'mmRouter/dist/mmRouter.js')
            }
        },
        output: {
            path: path.join(__dirname, _path),
            publicPath: server.rootPath, //这里需要更具具体情况来配置调整 公共路径
            filename: jsBundle
        },
        module: {
            loaders: [
                // 如果你需要 使用es6
                // {   test: /\.js$/,
                //     exclude: /node_modules/, //排除文件夹
                //     loader: 'babel', //解析 es6
                //     query:{
                //         presets:['babel-preset-es2015']
                //     }
                // },
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract('style', 'css')
                },{
                    test:/\.scss$/,
                    loader: ExtractTextPlugin.extract("css!sass")
                },{
                    test: /\.html$/,
                    loader: "html?-minimize" //避免压缩html,https://github.com/webpack/html-loader/issues/50
                },{
                    test: /\.(woff|woff2|ttf|eot|svg)(\?t=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'file-loader?name=fonts/[name].[ext]' //这里前缀路径 publicPath 参数为基础
                },{
                    test: /\.(png|jpe?g|gif)$/,
                    loader: 'url-loader?limit=8192&name=image/[name]-[hash].[ext]' //这里前缀路路径 publicPath 参数为基础
                },
                {
                    test: path.resolve(node_modules,'jquery/dist/jquery.js'), loader: 'expose?jQuery'
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin(cssBundle, {
                allChunks: true
            }),
            new webpack.ProvidePlugin({
                $: 'jquery', //加载$全局
                jQuery: 'jquery' //加载$全局
            }),
            DEBUG ? function() {} : new UglifyJsPlugin({ //压缩代码
                compress: {
                    warnings: false
                },
                except: [ '$', 'exports', 'require'] //排除关键字
            })
        ],
        //使用webpack-dev-server，提高开发效率
        //启用热服务有两种 如果是 api 启动方式, 这里只是一个配置目录,不会被webpack读取,
        //只有命令行才会读取这个参数
        devServer: {
            contentBase: path.resolve(pkg.config.buildDir),
            host:pkg.config.devHost,
            port: pkg.config.devPort,
            hot: true,
            noInfo: false,
            inline: true,
            stats: { colors: true }
        }
    };

    //html 模板插件
    pages.forEach(function(pathname) {

        var conf = {
            filename: './' + pathname + '.html', //生成的html存放路径，相对于path
            template: path.resolve(__dirname, './generate/' + pathname + '.html'), //html模板路径
            favicon: './app/image/favicon.ico',
            hash: true
            /*
             * 压缩这块，调用了html-minify，会导致压缩时候的很多html语法检查问题，
             * 如在html标签属性上使用{{...}}表达式，很多情况下并不需要在此配置压缩项，
             * 另外，UglifyJsPlugin会在压缩代码的时候连同html一起压缩。
             * 为避免压缩html，需要在html-loader上配置'html?-minimize'，见loaders中html-loader的配置。
             */
            /* minify: { //压缩HTML文件
             removeComments: true, //移除HTML中的注释
             collapseWhitespace: false //删除空白符与换行符
             }*/
        };

        if (pathname=="index") {
            conf.inject = 'body';
            conf.chunks = ['app'];
        }
        config.plugins.push(new HtmlWebpackPlugin(conf));
    });

    return config;
};


