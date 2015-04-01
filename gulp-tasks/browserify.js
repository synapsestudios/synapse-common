/* jshint node: true */
'use strict';

var browserify = require('browserify');
var proxyquire = require('proxyquireify');
var connect    = require('gulp-connect');
var glob       = require('glob');
var gulp       = require('gulp');
var gutil      = require('gulp-util');
var reactify   = require('reactify');
var replace    = require('gulp-replace-task');
var source     = require('vinyl-source-stream');
var streamify  = require('gulp-streamify');
var watchify   = require('watchify');
var watchr     = require('watchr');

var error = require('./error');

gulp.task('watchify:test', function () {
    var backend, updateBundler, bundler, entries, env, path, rebundle;

    backend = gutil.env.backend || '';
    env     = gutil.env.env;
    path    = gutil.env.path || './__tests__/**/*.js*';

    updateBundler = function() {
        entries = glob.sync(path);

        bundler = watchify(
            browserify({
                debug        : (env !== 'production'),
                entries      : entries,
                extensions   : ['.js', '.jsx'],
                cache        : {},
                packageCache : {},
                fullPaths    : true
            })
            .plugin(proxyquire.plugin)
            .ignore('./__tests__/globals.js')
            .transform(reactify)
            .on('log', gutil.log)
        );

        rebundle = function() {
            return bundler.bundle()
                .on('error', error('browserify:test'))
                .pipe(source('tests.js'))
                .pipe(streamify(
                    replace({
                        patterns : [{
                            match       : /__ENVIRONMENT__/g,
                            replacement : '\''+env+'\''
                        }, {
                            match       : /__BACKEND__/g,
                            replacement : '\''+backend+'\''
                        }]
                    })
                ))
                .pipe(gulp.dest('./test'))
                .pipe(connect.reload(true));
        };

        bundler.on('update', rebundle);

        rebundle();
    };

    updateBundler();

    watchr.watch({
        path     : './__tests__',
        listener : function(changeType) {
            if (changeType !== 'update') {
                updateBundler();
            }
        }
    });
});
