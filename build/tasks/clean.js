var d = require('../directories');
var gulp = require('gulp');
var plugins = require('../gulp-plugins');

module.exports = function() {
  return gulp
    .src([
      d.dest.base,
      d('{{src.styles}}/libs')
    ], { read: false })
    .pipe(plugins.rimraf());
};
