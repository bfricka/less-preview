var d = require('../directories');
var gulp = require('gulp');

module.exports = function() {
  gulp.watch(d('{modules}/**/*.js'), ['js']);
  gulp.watch(d('{styles}/**/*.less'), ['styles']);
  gulp.watch(d('{modules}/**/*.tpl.html'), ['html']);
  gulp.watch(d('{images}/**/*.{png|jpg}'), ['copy']);
};