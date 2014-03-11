var _ = require('lodash');
var path = require('path');

function directory() {
  return path.join.apply(path, [].slice.call(arguments).map(function(dir) {
    return path.normalize(dir);
  }));
}

module.exports = function(grunt) {
  var locals = {
    jsGlobals: Object.keys(grunt.file.readJSON('./.jshintrc').globals),
    paths: {
      js      : './public/javascripts',
      tmp     : './tmp',
      test    : './test',
      build   : './build',
      tasks   : './build/tasks',
      routes  : './routes',
      express : './express'
    }
  };

  _.forIn(locals.paths, function(p, key) {
    locals.paths[key] = path.normalize(p);
  });

  // Add grunt-config-merge
  require(directory(locals.paths.build, 'grunt-config-merge'))(grunt, locals);

  var tasks = [
    'get-javascripts',
    'meta',
    'concat',
    'uglify',
    'watch'
  ].forEach(function(task) {
    require(directory(locals.paths.tasks))(grunt, locals);
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', [
    'concat:app',
    'concat:vendor',
    'jshint',
    'uglify',
    'concat:build'
  ]);
};