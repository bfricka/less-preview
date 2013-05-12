module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json')
    , meta: {
      banner: [
          '/* <%= pkg.name %> - v<%= pkg.version %> - <%= pkg.homepage %>\n'
        , ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>. All rights reserved.\n'
        , ' * Licensed <%= _.pluck(pkg.licenses, "type")[0] %> - <%= _.pluck(pkg.licenses, "url")[0] %>\n'
        , ' */\n'
      ].join('')
    }

    , paths: {
        js      : './public/javascripts'
      , tmp     : './tmp'
      , routes  : './routes'
      , express : './express'
    }

    , concat: {
      app: {
        src: [
            '<%= paths.js %>/options-drawer.js'
          , '<%= paths.js %>/app/app.js'
          , '<%= paths.js %>/app/services/Stor.js'
          , '<%= paths.js %>/app/services/LessCompiler.js'
          , '<%= paths.js %>/app/directives/fadeShow.js'
          , '<%= paths.js %>/app/directives/lessEditor.js'
          , '<%= paths.js %>/app/controllers/Less2CssCtrl.js'
        ]
        , dest: '<%= paths.js %>/less2css.js'
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
        , tasks: ['jshint', 'uglify', 'karma:unit:run']
      }
      , tests: {
          files: ['./test/**/*.spec.js']
        , tasks: ['karma:unit:run']
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
      options: { jshintrc: './.jshintrc' }
      , all: ['<%= paths.js %>/less2css.js']
    }
  });

  grunt.registerTask('default', [
    'concat:app'
    , 'jshint'
    , 'uglify'
    , 'concat:build'
    , 'karma'
  ]);
};