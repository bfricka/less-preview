var gulp = require('gulp');

gulp.task('copy', require('./build/tasks/copy'));
gulp.task('list', require('./build/tasks/list'));
gulp.task('html', require('./build/tasks/html'));
gulp.task('clean', require('./build/tasks/clean'));
gulp.task('styles', ['copy'], require('./build/tasks/styles'));
gulp.task('javascripts-app', require('./build/tasks/javascripts').app);
gulp.task('javascripts-vendor', require('./build/tasks/javascripts').vendor);
gulp.task('replace', ['javascripts-app', 'javascripts-vendor'], require('./build/tasks/replace'));

gulp.task('watch', require('./build/tasks/watch'));

gulp.task('build', ['clean'], function() {
  gulp.start(
    'html',
    'styles',
    'javascripts-app',
    'javascripts-vendor',
    'replace'
  );
});

gulp.task('default', ['build', 'watch']);