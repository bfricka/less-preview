#global module:false
module.exports = (grunt) ->

  banner = "/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - "
  + "<%= grunt.template.today(\"yyyy-mm-dd\") %>\n"
  + "<%= pkg.homepage ? \"* \" + pkg.homepage + \"\n\" : \"\" %>"
  + "* Copyright (c) <%= grunt.template.today(\"yyyy\") %> <%= pkg.author.name %>;"
  + " Licensed <%= _.pluck(pkg.licenses, \"type\").join(\", \") %> */"

  # grunt.loadNpmTasks('gruntacular');
  grunt.loadNpmTasks "grunt-contrib-uglify"
  # grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-jshint"
  grunt.loadNpmTasks "grunt-contrib-coffee"

  # Project configuration.
  grunt.initConfig
    pkg: "<json:package.json>"
    meta:
      banner: banner

    coffee:
      compile:
        options:
          bare: true
        files:
          "public/javascripts/less2css.js": "coffee/less2css.coffee"
          "lessVersions.js": "lessVersions.coffee"

    watch:
      coffee:
        files: ["coffee/**/*.coffee", "lessVersions.coffee"]
        tasks: ["coffee"]

      js:
        files: [
          "./public/javascripts/less2css.js"
        ]
        tasks: ["jshint", "uglify"]

    uglify:
      less2css:
        options:
          mangle: false

        files:
          "public/javascripts/less2css.min.js": ["<banner:meta.banner>", "public/javascripts/less2css.js"]

    jshint:
      options:
        "curly"    : true
        "eqeqeq"   : true
        "immed"    : true
        "latedef"  : true
        "newcap"   : true
        "noarg"    : true
        "sub"      : true
        "undef"    : true
        "boss"     : true
        "eqnull"   : true
        "browser"  : true
        "laxcomma" : true
        "laxbreak" : true

        "globals":
          "CodeMirror" : true
          "amplify"    : true
          "jQuery"     : true
          "hljs"       : true
          "less"       : true
          "$"          : true

      all: ["public/javascripts/less2css.js"]


  # Default task.
  grunt.registerTask "default", ["coffee", "jshint", "uglify"]