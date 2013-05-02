var karma = require('karma');

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json')
    , meta: {
      banner: [
          '/* <%= pkg.name %> - v<%= pkg.version %> - <%= pkg.homepage %>\n'
        , '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>. All rights reserved.\n'
        , '* Licensed <%= _.pluck(pkg.licenses, "type")[0] %> - <%= _.pluck(pkg.licenses, "url")[0] %> */\n'
      ].join('')
    }

    , paths: {
        js      : './public/javascripts'
      , tmp     : './tmp'
      , routes  : './routes'
      , express : './express'
    }

    , concat: {
      less2css: {
        src: [
            '<%= paths.js %>/Stor.js'
          , '<%= paths.js %>/OptionsDrawer.js'
          , '<%= paths.js %>/app.js'
          , '<%= paths.js %>/less2css/directives.js'
          , '<%= paths.js %>/less2css/LessCacheService.js'
          , '<%= paths.js %>/less2css/LessCompilerService.js'
          , '<%= paths.js %>/less2css/controllers.js'
        ]
        , dest: '<%= paths.tmp %>/less2css.js'
      }

      , build: {
        options: { banner: '<%= meta.banner %>'}
        , files: {
          '<%= paths.js %>/less2css.js': ['<%= paths.js %>/less2css.js'],
          '<%= paths.js %>/less2css.min.js': ['<%= paths.js %>/less2css.min.js']
        }
      }
    }

    , watch: {
      js: {
          files: ['<%= paths.js %>/less2css.js']
        , tasks: ['jshint', 'uglify', 'test']
      }
      , tests: {
          files: ['./test/**/*.spec.coffee']
        , tasks: ['test']
      }
    }

    , uglify: {
      less2css: {
        options: {
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
          , mangle: { except: ['OptionsDrawer', 'CodeMirror', 'angular', 'amplify', 'jQuery', 'Stor', 'less', '$', '_'] }
        }
        , files: { '<%= paths.js %>/less2css.min.js': ['<%= paths.js %>/less2css.js', '<banner:meta.banner>'] }
      }
    }
    , jshint: {
      options: {
        jshintrc: './.jshintrc'
      }
      , all: ['<%= paths.js %>/less2css.js']
    }
  });

  grunt.registerTask('default', ['concat:less2css', 'jshint', 'uglify', 'concat:build', 'test']);

  grunt.registerTask('testserver', 'start karma server', function() {
    var done = this.async();
    karma.server.start({
      configFile: 'test/karma.conf.js'
    });
  });

  grunt.registerTask('test', 'run tests (make sure server task is run first)', function() {
    var done = this.async();
    return grunt.util.spawn({
      cmd: (process.platform === 'win32' ? 'karma.cmd' : 'karma'),
      args: ['run']
    }, function(error, result, code) {
      if (error) {
        grunt.warn(
          'Make sure the karma server is online: run `grunt server`.\n' +
          'Also make sure you have a browser open to http://localhost:8080/.\n' +
          error.stdout + error.stderr);
        setTimeout(done, 1000);
      } else {
        grunt.log.write(result.stdout);
        done();
      }
    });
  });
};
