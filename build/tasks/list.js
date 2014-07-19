var gulp = require('gulp');
var util = require('util');
var plugins = require('../gulp-plugins');

module.exports = function() {
  console.log("\nPlugins\n==============================");
  console.log(util.inspect(plugins, { colors: true, depth: null }));
  console.log("\nTasks\n==============================");
  console.log(util.inspect(gulp.tasks, { colors: true, depth: null }));
};
