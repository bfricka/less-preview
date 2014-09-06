var d = require('../directories');
var gulp = require('gulp');
var plugins = require('../gulp-plugins');

var htmlmin_opts = {
  removeComments        : true,
  collapseWhitespace    : true,
  conservativeCollapse  : true,
  remoteAttributeQuotes : true,
  ignoreCustomComments  : []
};

var uglifyjs_opts = {
  warnings: true,
  compressor: { unsafe: true },
  enclose: {
    'window._'       : '_',
    'window.angular' : 'angular',
    'window'         : 'window'
  }
};

module.exports = function() {
  return gulp
    .src(d('{{src.modules}}/**/*.tpl.html'))
    .pipe(plugins.htmlmin(htmlmin_opts))
    .pipe(plugins.angularTemplatecache('ng-templates.js', {
      module: 'less2css.tpls',
      standalone: true,
      base: function(file) { return '/tpls/' + file.relative }
    }))
    .pipe(plugins.uglifyjs(uglifyjs_opts))
    .pipe(gulp.dest(d.dest.javascripts));
};
