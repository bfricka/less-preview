var q = require('bluebird');
var d = require('../directories');
var gulp = require('gulp');

module.exports = function() {
  var d1 = q.defer();
  var d2 = q.defer();
  var d3 = q.defer();

  gulp
    .src([
      d('{src.vendor}/bootstrap/less/**/*.less'),
      d('{src.vendor}/lesshat/build/lesshat-prefixed.less')
    ], { cwd: d('{src.vendor}/**') })
    .pipe(gulp.dest(d('{src.styles}/libs')))
    .on('end', d1.resolve.bind(d1));

  gulp
    .src(d('{src.vendor}/bootstrap/fonts/*'))
    .pipe(gulp.dest(d('{dest.images}/fonts')))
    .on('end', d2.resolve.bind(d2));

  gulp
    .src([
      d('{src.less}/dist/*.js'),
      d('!{src.less}/dist/less-rhino*.js')
    ])
    .pipe(gulp.dest(d('{dest.base}/less')))
    .on('end', d3.resolve.bind(d3));

  return q.all([ d1.promise, d2.promise, d3.promise ]);
};
