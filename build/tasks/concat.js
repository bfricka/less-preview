module.exports = function(grunt, locals) {
  var src = locals.javascripts;

  grunt.mergeConfig({
    concat: {
      app: {
        src: src.app,
        dest: '<%= paths.tmp %>/less2css.js'
      },
      vendor: {
        src: src.vendor,
        dest: '<%= paths.tmp %>/vendor.js'
      },

      build: {
        options: { banner: '<%= meta.banner %>'},
        files: {
          '<%= paths.js %>/less2css.min.js': ['<%= paths.js %>/less2css.min.js']
        }
      }
    }
  });
};