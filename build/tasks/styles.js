var d = require('../directories');
var gulp = require('gulp');
var plugins = require('../gulp-plugins');

module.exports = {
  copyLess: function() {
    return gulp
      .src([
        'bootstrap/less/**/*.less',
        'lesshat/build/lesshat-prefixed.less'
      ], { cwd: d('{{src.vendor}}/**') })
      .pipe(gulp.dest(d('{{src.styles}}/libs')));
  },

  copyFonts: function() {
    return gulp
      .src(d('{{src.vendor}}/bootstrap/fonts/*'))
      .pipe(gulp.dest(d('{{dest.images}}/fonts')));
  },

  copyImages: function() {
    return gulp
      .src(d('{{src.images}}/**/*.*'))
      .pipe(gulp.dest(d('{{dest.images}}')));
  },

  dev: function() {
    return gulp
      .src(d('{{src.styles}}/styles.less'))
      .pipe(plugins.less({ sourceMap: true }))
      .pipe(gulp.dest(d.dest.styles));
  },

  dist: function() {
    return gulp
      .src(d('{{src.styles}}/styles.less'))
      .pipe(plugins.less({ cleancss: true, rootpath: '/' }))
      .pipe(plugins.concat('styles.min.css'))
      .pipe(gulp.dest(d.dest.styles));
  }
};
