module.exports = function(grunt) {
  grunt.mergeConfig({
    watch: {
      js: {
        files: [
            '<%= paths.js %>/options-drawer.js'
          , '<%= paths.js %>/src/**/*.js'
        ]
        , tasks: ['concat:app', 'jshint']
      }
      , tests: {
          files: ['<%= paths.test %>/**/*.spec.js']
        , tasks: ['karma:unit:run']
      }
    }
  });
};