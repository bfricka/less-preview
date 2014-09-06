var d = require('../directories');
var gulp = require('gulp');

module.exports = function() {
  gulp.watch(d('{{src.modules}}/**/*.js'), ['javascripts-app']);
  gulp.watch(d('{{src.styles}}/**/*.less'), ['styles']);
  gulp.watch(d('{{src.modules}}/**/*.tpl.html'), ['html']);
  // gulp.watch(d('{{src.images}}/**/*.{png|jpg}'), ['copy']);
};
