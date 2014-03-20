var scripts = require('./express/app-scripts')(process.cwd());
var src = scripts.development();

module.exports = function(grunt) {
  var js_globals = Object.keys(grunt.file.readJSON('./.jshintrc').globals);
  var uglify_options = {
    compress: {
      loops        : true,
      unused       : true,
      unsafe       : true,
      cascade      : true,
      warnings     : true,
      booleans     : true,
      evaluate     : true,
      dead_code    : true,
      join_vars    : true,
      if_return    : true,
      sequences    : true,
      hoist_vars   : false,
      hoist_funs   : true,
      properties   : true,
      comparisons  : true,
      conditionals : true
    },
    mangle: { except: js_globals }
  };

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: [
        '/* <%= pkg.name %> - v<%= pkg.version %> - <%= pkg.homepage %>',
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>. All rights reserved.',
        ' * Licensed <%= _.pluck(pkg.licenses, "type")[0] %> - <%= _.pluck(pkg.licenses, "url")[0] %>',
        ' */',
        ''
      ].join('\n')
    },

    paths: {
      js      : './public/javascripts',
      tmp     : './tmp',
      test    : './test',
      routes  : './routes',
      express : './express'
    },

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
    },

    watch: {
      js: {
        files: [
          '<%= paths.js %>/options-drawer.js',
          '<%= paths.js %>/src/**/*.js'
        ],
        tasks: ['concat:app', 'jshint']
      },
      tests: {
        files: ['<%= paths.test %>/**/*.spec.js'],
        tasks: ['karma:unit:run']
      }
    },

    uglify: {
      app: {
        options: uglify_options,
        files: {
          '<%= paths.js %>/less2css.min.js': ['<%= paths.tmp %>/less2css.js']
        }
      },
      vendor: {
        options: uglify_options,
        files: {
          '<%= paths.js %>/vendor.min.js': ['<%= paths.tmp %>/vendor.js']
        }
      }
    },
    jshint: {
      options: { jshintrc: './.jshintrc' },
      all: ['<%= paths.tmp %>/less2css.js']
    }
  });

  grunt.registerTask('default', [
    'concat:app',
    'concat:vendor',
    'jshint',
    'uglify',
    'concat:build'
  ]);
};