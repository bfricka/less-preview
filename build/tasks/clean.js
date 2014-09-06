var q = require('q');
var d = require('../directories');
var gulp = require('gulp');
var rimraf = require('rimraf');
var plugins = require('../gulp-plugins');

module.exports = function() {
  var d1 = q.defer();
  var d2 = q.defer();

  rimraf(d.dest.base, d1.resolve);
  rimraf(d('{{src.styles}}/libs'), d2.resolve);

  return q.all([d1.promise, d2.promise]);
};
