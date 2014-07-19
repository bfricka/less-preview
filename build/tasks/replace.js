var d = require('../directories');
var gulp = require('gulp');
var plugins = require('../gulp-plugins');

module.exports = function(cb) {
  cb();
  // return gulp
  //   .src(d('{{dest.javascripts}}/*.map'))
  //   .pipe(plugins.replace('public/dist', ''))
  //   .pipe(gulp.dest(d.dest.javascripts));
};
