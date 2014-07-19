var q = require('bluebird');
var d = require('../directories');
var gulp = require('gulp');
var plugins = require('../gulp-plugins');

var htmlmin_opts = {
  removeComments: true,
  collapseWhitespace: true,
  conservativeCollapse: true,
  remoteAttributeQuotes: true,
  ignoreCustomComments: []
};

var uglifyjs_opts = {
  warnings: true,
  compressor: { unsafe: true },
  enclose: {
    'window._': '_',
    'window.angular': 'angular',
    'window': 'window'
  }
};

module.exports = function() {
  var d1 = q.defer();
  var d2 = q.defer();

  gulp
      .src(d('{modules}/**/*.tpl.html'))
      .pipe(plugins.htmlmin(htmlmin_opts))
      .pipe(plugins.angularTemplatecache('ng-templates.js', {
        module: 'sexyImages.tpls',
        standalone: true,
        base: function(file) { return '/templates/' + file.relative }
      }))
      .pipe(plugins.uglifyjs(uglifyjs_opts))
      .pipe(gulp.dest(d.output.javascripts))
      .on('end', d1.resolve);

  gulp
    .src(process.cwd() + '/index.html')
    .pipe(plugins.htmlmin(htmlmin_opts))
    .pipe(gulp.dest(d.output.base))
    .on('end', d2.resolve);

  return q.all([d1.promise, d2.promise]);
};
