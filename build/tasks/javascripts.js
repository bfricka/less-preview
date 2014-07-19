var _ = require('lodash');
var d = require('../directories');
var gulp = require('gulp');
var plugins = require('../gulp-plugins');

var uglifyjs_opts = {
  outSourceMap: true,
  warnings: true,
  compressor: { unsafe: true },
  enclose: {
    'window._': '_',
    'window.angular': 'angular',
    'window': 'window'
  }
};

var uglifyjs_opts_vendor = _.defaults({
  enclose: {
    'window': 'window',
    'document': 'document'
  }
}, uglifyjs_opts);

module.exports = {
  app: function() {
    return gulp
      .src(d('{modules}/**/*.js'))
      .pipe(plugins.jshint())
      .pipe(plugins.jshint.reporter('jshint-stylish'))
      .pipe(plugins.angularFilesort())
      .pipe(gulp.dest(d.output.javascripts))
      .pipe(plugins.uglifyjs('app.min.js', uglifyjs_opts))
      .pipe(gulp.dest(d.output.javascripts));
  },

  vendor: function() {
    return gulp
      .src([
        d('{vendor}/lodash/dist/lodash.js'),
        d('{vendor}/angular/angular.js'),
        d('{vendor}/angular-animate/angular-animate.js'),
        d('{vendor}/angular-cookies/angular-cookies.js'),
        d('{vendor}/angular-ui-router/release/angular-ui-router.js'),
        d('{vendor}/angular-bootstrap/ui-bootstrap.js')
      ])
      .pipe(gulp.dest(d.output.javascripts))
      .pipe(plugins.uglifyjs('vendor.min.js', uglifyjs_opts_vendor))
      .pipe(gulp.dest(d.output.javascripts));
  }
};