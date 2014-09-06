var gulp = require('gulp');

gulp.task('clean', require('./build/tasks/clean'));
gulp.task('copy-less', ['clean'], require('./build/tasks/styles').copyLess);
gulp.task('copy-fonts', ['clean'], require('./build/tasks/styles').copyFonts);
gulp.task('copy-images', ['copy-fonts'], require('./build/tasks/styles').copyImages);
gulp.task('copy-javascripts', ['clean'], require('./build/tasks/javascripts').copy);
gulp.task('list', require('./build/tasks/list'));
gulp.task('html', require('./build/tasks/html'));
gulp.task('styles-dev', require('./build/tasks/styles').dev);
gulp.task('styles-dist', require('./build/tasks/styles').dist);
gulp.task('javascripts-app', require('./build/tasks/javascripts').app);
gulp.task('javascripts-vendor', require('./build/tasks/javascripts').vendor);
gulp.task('watch', require('./build/tasks/watch'));

var build_deps = {
  'styles-dev': ['copy-less', 'copy-fonts', 'copy-images'],
  'styles-dist': ['copy-less', 'copy-fonts']
};

Object.keys(gulp.tasks)
  .filter(function(task) { return !/clean|copy|list/.test(task) })
  .forEach(function(task) {
    var deps = build_deps[task] || ['clean'];
    gulp.task('build-' + task, deps, gulp.tasks[task].fn);
  });

gulp.task('build-dev', function() {
  gulp.start(
    'build-html',
    'build-styles-dev',
    'build-javascripts-app',
    'build-javascripts-vendor'
  );
});

gulp.task('default', ['build-watch']);
