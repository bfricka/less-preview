var d = require('../directories');
var gulp = require('gulp');
var plugins = require('../gulp-plugins');

module.exports = function() {
  return gulp
    .src(d.output.javascripts + '/*.map')
    .pipe(plugins.replace('public/dist', ''))
    .pipe(gulp.dest(d.output.javascripts));
};