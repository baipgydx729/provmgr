var clean = require('gulp-clean');
var fileinclude = require('gulp-file-include');
var gulp = require('gulp');
var gutil = require('gulp-util');
var merge = require('webpack-merge');
var runSequence = require('run-sequence');
var webpack = require('webpack');
'use strict';

var webpack_config = require('./webpack.config');

gulp.task('clean-generate', function () {
	return gulp.src(['generate']).pipe(clean());
});

gulp.task('clean-dist', function () {
	return gulp.src(['dist']).pipe(clean());
});

gulp.task('generate-template', function () {
    return gulp.src(['app/**/*.html'])
        .pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
        }))
        .pipe(gulp.dest('generate'));
});

gulp.task('generate-image', function () {
    return gulp.src(['app/image/**/*'])
        .pipe(gulp.dest('generate/image'));
});

gulp.task('webpack-dev', function(callback){
	var config = merge(webpack_config({debug:true}), {
		devtool : "source-map"
	});

	webpack(config).run(function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:webpack-dev", err);
        gutil.log("[webpack:webpack-dev]", stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task('webpack-pro', function(callback){
	var config = merge(webpack_config({debug:false}));
	
	webpack(config).run(function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:webpack-dev", err);
        gutil.log("[webpack:webpack-dev]", stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task('copy-dist', function () {
    return gulp.src(['dist/**/*'])
        .pipe(gulp.dest('../src/main/webapp'));
});

gulp.task('watch', function () {
    return gulp.watch('app/**/*', function() {
    	runSequence(['clean-generate', 'clean-dist'], 'generate-template', 'generate-image', 'webpack-dev');
    });
});

gulp.task('dev', function() {
	runSequence(['clean-generate', 'clean-dist'], 'generate-template', 'generate-image', ['webpack-dev', 'watch'], 'copy-dist');
});

gulp.task('pro', function() {
	runSequence(['clean-generate', 'clean-dist'], 'generate-template', 'generate-image', 'webpack-pro', 'copy-dist');
});
