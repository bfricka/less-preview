var q = require('bluebird');
var d = require('../directories');
var gulp = require('gulp');

module.exports = function() {
  var d1 = q.defer();
  var d2 = q.defer();
  var d3 = q.defer();
  var d4 = q.defer();

  gulp
    .src(d('{vendor}/bootstrap/less/*.less'))
    .pipe(gulp.dest(d('{styles}/libs/bootstrap')))
    .on('end', d1.resolve);

  gulp
    .src(d('{vendor}/lesshat/build/lesshat.less'))
    .pipe(gulp.dest(d('{styles}/libs/lesshat')))
    .on('end', d2.resolve);

  gulp
    .src(d('{vendor}/bootstrap/fonts/*'))
    .pipe(gulp.dest(d('{images}/fonts')))
    .on('end', d3.resolve);

  d3.promise.then(function() {
    return gulp
      .src(d('{images}/**/*'))
      .pipe(gulp.dest(d.output.images))
      .on('end', d4.resolve);
  });

  return q.all([d1.promise, d2.promise, d3.promise, d4.promise]);
};
