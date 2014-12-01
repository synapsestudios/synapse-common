/* jshint node: true */
'use strict';

var gulp     = require('gulp');
var gutil    = require('gulp-util');

// Require all our tasks
require('./gulp-tasks/browserify');
require('./gulp-tasks/preprocess');
require('./gulp-tasks/connect');

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
