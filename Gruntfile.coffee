#global module:false
testacular = require 'testacular'

module.exports = (grunt) ->

  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-jshint"
  grunt.loadNpmTasks "grunt-contrib-coffee"

  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    meta:
      # Build the JS banner based on pkg file data
      banner: do ->
        banner = "/* <%= pkg.name %> - v<%= pkg.version %> - <%= pkg.homepage %>"
        banner += "\n"
        banner += "* Copyright (c) <%= grunt.template.today('yyyy') %> <%= pkg.author %>. All rights reserved."
        banner += "\n"
        banner += "* Licensed <%= _.pluck(pkg.licenses, 'type')[0] %> - <%= _.pluck(pkg.licenses, 'url')[0] %> */"
        banner += "\n"
        banner

    paths:
      # Ref common paths so we can use built-in lodash templating.
      coffee : "./public/coffee/"
      tmp    : "./tmp/"
      js     : "./public/javascripts/"

    concat:
      # Concat less2css into temp dir. So it can be wrapped in a single
      # SEAF, since coffee-contrib doesn't have this option.
      less2css:
        src: [
          "<%= paths.coffee %>Stor.coffee"
          "<%= paths.coffee %>OptionsDrawer.coffee"
          "<%= paths.coffee %>app.coffee"
          "<%= paths.coffee %>less2css/directives.coffee"
          "<%= paths.coffee %>less2css/LessCacheService.coffee"
          "<%= paths.coffee %>less2css/LessCompilerService.coffee"
          "<%= paths.coffee %>less2css/controllers.coffee"
        ]
        dest: "<%= paths.tmp %>less2css.coffee"

      # Build to add banners to JS
      build:
        options:
          banner: "<%= meta.banner %>"
        files:
          "<%= paths.js %>less2css.js": ["<%= paths.js %>less2css.js"]
          "<%= paths.js %>less2css.min.js": ["<%= paths.js %>less2css.min.js"]

    coffee:
      # Note: concat needs to be run in order to gen tmp directory and file
      # for less2css.
      compile:
        options:
          bare: false
        files:
          "<%= paths.js %>less2css.js": "<%= paths.tmp %>less2css.coffee"
          "<%= paths.js %>less-options.js": "<%= paths.coffee %>less-options.coffee"
          "app.js": "app.coffee"

    watch:
      coffee:
        files: [
          "<%= paths.coffee %>**/*.coffee"
          "app.coffee"
        ]
        tasks: ["concat:less2css", "coffee"]

      js:
        files: [
          "<%= paths.js %>less2css.js"
        ]
        tasks: ["jshint", "uglify", "test"]

      tests:
        files: [
          "./test/**/*.spec.coffee"
        ]
        tasks: ["test"]

    uglify:
      less2css:
        options:
          # Default compress options. Listed for reference.
          compress:
            conditionals : true
            comparisons  : true
            properties   : true
            hoist_funs   : true
            hoist_vars   : false
            sequences    : true
            if_return    : true
            join_vars    : true
            dead_code    : true
            evaluate     : true
            booleans     : true
            warnings     : true
            cascade      : true
            unsafe       : true
            unused       : true
            loops        : true

          mangle:
            except: [
              "OptionsDrawer"
              "EventEmitter"
              "CodeMirror"
              "angular"
              "amplify"
              "jQuery"
              "Stor"
              "hljs"
              "less"
              "$"
              "_"
            ]

        files:
          "<%= paths.js %>less2css.min.js": [
            "<%= paths.js %>less2css.js"
            "<banner:meta.banner>"
          ]

    jshint:
      options:
        "sub"      : true
        "boss"     : true
        "devel"    : true
        "curly"    : false
        "immed"    : true
        "noarg"    : true
        "undef"    : true
        "shadow"   : true
        "newcap"   : false
        "eqnull"   : true
        "eqeqeq"   : true
        "browser"  : true
        "latedef"  : true
        "laxcomma" : true
        "laxbreak" : true

        "globals":
          "CodeMirror" : true
          "angular"    : true
          "amplify"    : true
          "jQuery"     : true
          "hljs"       : true
          "less"       : true
          "$"          : true
          "_"          : true

      all: ["<%= paths.js %>less2css.js"]

  # Default task.

  grunt.registerTask "default", [
    "concat:less2css"
    "coffee"
    "jshint"
    "uglify"
    "concat:build"
    "test"
  ]

  grunt.registerTask "testserver", "start testacular server", ->
    #Mark the task as async but never call done, so the server stays up
    done = @async()
    testacular.server.start configFile: "test/testacular.conf.js"

  # Invoke tests on testacular server.
  grunt.registerTask "test", "run tests (make sure server task is run first)", ->
    done = @async()

    grunt.util.spawn
      cmd: (if process.platform is "win32" then "testacular.cmd" else "testacular")
      args: ["run"]
    , (error, result, code) ->
      if error
        grunt.warn
        "Make sure the testacular server is online: run `grunt server`.\n" +
        "Also make sure you have a browser open to http://localhost:8080/.\n" +
        error.stdout + error.stderr

        #the testacular runner somehow modifies the files if it errors(??).
        #this causes grunt's watch task to re-fire itself constantly,
        #unless we wait for a sec
        setTimeout done, 1000
      else
        grunt.log.write result.stdout
        done()

