

module.exports = function(grunt) {
  var locals = {
    jsGlobals: Object.keys(grunt.file.readJSON('./.jshintrc').globals),
    paths: {
      js      : './public/javascripts',
      tmp     : './tmp',
      test    : './test',
      routes  : './routes',
      express : './express'
    }
  };

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