module.exports = function(grunt, locals) {
  var uglify_options = {
    compress: {
        loops        : true
      , unused       : true
      , unsafe       : true
      , cascade      : true
      , warnings     : true
      , booleans     : true
      , evaluate     : true
      , dead_code    : true
      , join_vars    : true
      , if_return    : true
      , sequences    : true
      , hoist_vars   : false
      , hoist_funs   : true
      , properties   : true
      , comparisons  : true
      , conditionals : true
    }
    , mangle: { except: locals.jsGlobals }
  };

  grunt.mergeConfig({
    uglify: {
      app: {
        options: uglify_options
        , files: {
          '<%= paths.js %>/less2css.min.js': ['<%= paths.tmp %>/less2css.js']
        }
      }
      , vendor: {
        options: uglify_options
        , files: {
          '<%= paths.js %>/vendor.min.js': ['<%= paths.tmp %>/vendor.js']
        }
      }
    }
    , jshint: {
      options: { jshintrc: './.jshintrc' }
      , all: ['<%= paths.tmp %>/less2css.js']
    }
  });
};