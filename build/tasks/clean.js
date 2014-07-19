var gulp = require('gulp');
var d = require('../directories');
var plugins = require('../gulp-plugins');

module.exports = function() {
  return gulp
    .src(d.output.base, { read: false })
    .pipe(plugins.rimraf());
};