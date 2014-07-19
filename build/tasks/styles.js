var q = require('bluebird');
var d = require('../directories');
var gulp = require('gulp');
var plugins = require('../gulp-plugins');

module.exports = function() {
  var d1 = q.defer();
  var d2 = q.defer();

  gulp
    .src(d('{styles}/styles.less'))
    .pipe(plugins.less({ sourceMap: true }))
    .pipe(gulp.dest(d.output.styles))
    .on('end', d1.resolve);

  gulp
    .src(d('{styles}/styles.less'))
    .pipe(plugins.less({ cleancss: true, rootpath: '/' }))
    .pipe(plugins.concat('styles.min.css'))
    .pipe(gulp.dest(d.output.styles))
    .on('end', d2.resolve);

  return q.all([d1.promise, d2.promise]);
};
