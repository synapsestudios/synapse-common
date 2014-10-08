/* jshint node: true */
'use strict';

var gulp     = require('gulp');
var gutil    = require('gulp-util');
var connect  = require('gulp-connect');
var fallback = require('connect-history-api-fallback');

// Require all our tasks
require('./gulp-tasks/browserify');

// Set default environment
if ( ! gutil.env.env) {
    gutil.env.env = 'development';
}

gutil.log('Environment', gutil.colors.magenta(gutil.env.env));

if (gutil.env.backend) {
    gutil.log('Backend', gutil.colors.magenta(gutil.env.backend));
}

// Build tests, run server, and watch for changes
gulp.task('test', ['preprocess:test', 'watchify:test', 'connect:test', 'delta:test']);

gulp.task('delta:test', function() {
    gulp.watch(['./tests/**/*.html'], ['preprocess:test']);
});

gulp.task('preprocess:test', function() {
    return gulp.src([
            './__tests__/index.html',
            './__tests__/favicon.png',
            './node_modules/mocha/mocha.css',
            './node_modules/mocha/mocha.js'
        ])
        .pipe(gulp.dest('./test'))
        .pipe(connect.reload());
});

gulp.task('connect:test', function() {
    return connect.server({
        root       : 'test',
        port       : 9001,
        livereload : true,
        middleware : function (connect, options) {
            return [fallback];
        }
    });
});
