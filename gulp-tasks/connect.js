'use strict';

var gulp       = require('gulp');
var connect    = require('gulp-connect');
var fallback   = require('connect-history-api-fallback');

gulp.task('connect:test', function() {
    return connect.server({
        root       : 'test',
        port       : 9999,
        livereload : true,
        middleware : function (connect, options) {
            return [fallback];
        }
    });
});
