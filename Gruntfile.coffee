#global module:false
testacular = require 'testacular'

module.exports = (grunt) ->

  grunt.loadNpmTasks "grunt-contrib-uglify"
  # grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-jshint"
  grunt.loadNpmTasks "grunt-contrib-coffee"

  # Project configuration.
  grunt.initConfig
    pkg: "<json:package.json>"

    meta:
      banner: "/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> -
      <%= grunt.template.today(\"yyyy-mm-dd\") %>\n
      <%= pkg.homepage ? \"* \" + pkg.homepage + \"\n\" : \"\" %>
      * Copyright (c) <%= grunt.template.today(\"yyyy\") %> <%= pkg.author.name %>;
      Licensed <%= _.pluck(pkg.licenses, \"type\").join(\", \") %> */"

    paths:
      coffee: "./public/coffee/"
      js: "./public/javascripts/"

    coffee:
      compile:
        options:
          bare: true
        files:
          "<%= paths.js %>less2css.js": [
            "<%= paths.coffee %>EventEmitter.coffee"
            "<%= paths.coffee %>OptionsDrawer.coffee"
            "<%= paths.coffee %>Stor.coffee"
            "<%= paths.coffee %>less2css.coffee"
          ]
          "<%= paths.js %>lessVersions.js": "<%= paths.coffee %>lessVersions.coffee"
          "app.js": "app.coffee"

    watch:
      coffee:
        files: [
          "<%= paths.coffee %>**/*.coffee"
          "app.coffee"
        ]
        tasks: ["coffee"]

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
          mangle: false

        files:
          "<%= paths.js %>less2css.min.js": [
            "<banner:meta.banner>"
            "<%= paths.js %>less2css.js"
          ]

    jshint:
      options:
        "sub"      : true
        "boss"     : true
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
          "amplify"    : true
          "jQuery"     : true
          "hljs"       : true
          "less"       : true
          "$"          : true

      all: ["<%= paths.js %>less2css.js"]

  # Default task.

  grunt.registerTask "default", ["coffee", "jshint", "uglify", "test"]

  grunt.registerTask "testserver", "start testacular server", ->
    #Mark the task as async but never call done, so the server stays up
    done = @async()
    testacular.server.start configFile: "test/testacular.conf.js"

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

