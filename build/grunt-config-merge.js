module.exports = function(grunt) {
  grunt.config.merge = grunt.mergeConfig = function(gruntConfig) {
    forOwn(gruntConfig, function(taskConfig, task) {
      forOwn(taskConfig, function(targetConfig, target) {
        grunt.config.set([ task, target ], targetConfig);
      });
    });
  };

  function forOwn(obj, callback) {
    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        callback(obj[p], p);
      }
    }
  }
};