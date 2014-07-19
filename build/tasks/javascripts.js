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
      .src(d('{{src.modules}}/**/*.js'))
      .pipe(plugins.jshint())
      .pipe(plugins.jshint.reporter('jshint-stylish'))
      .pipe(plugins.angularFilesort())
      .pipe(gulp.dest(d.dest.javascripts))
      .pipe(plugins.uglifyjs('app.min.js', uglifyjs_opts))
      .pipe(gulp.dest(d.dest.javascripts));
  },

  vendor: function() {
    return gulp
      .src([
        d('{{src.vendor}}/lodash/dist/lodash.js'),
        d('{{src.vendor}}/angular/angular.js'),
        d('{{src.vendor}}/angular-animate/angular-animate.js'),
        d('{{src.vendor}}/angular-cookies/angular-cookies.js'),
        d('{{src.vendor}}/angular-ui-router/release/angular-ui-router.js'),
        d('{{src.vendor}}/angular-bootstrap/ui-bootstrap.js'),
        d('{{src.vendor}}/codemirror/lib/codemirror.js'),
        d('{{src.vendor}}/codemirror/addon/edit/closebrackets.js'),
        d('{{src.vendor}}/codemirror/addon/edit/matchbrackets.js'),
        // d('{{src.vendor}}/codemirror/addon/fold/foldgutter.js'),
        // d('{{src.vendor}}/codemirror/addon/fold/brace-fold.js'),
        // d('{{src.vendor}}/codemirror/addon/fold/indent-fold.js'),
      ])
      .pipe(gulp.dest(d.dest.javascripts))
      .pipe(plugins.uglifyjs('vendor.min.js', uglifyjs_opts_vendor))
      .pipe(gulp.dest(d.dest.javascripts));
  }
};
