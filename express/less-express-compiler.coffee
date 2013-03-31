__ = require 'lodash'
lessOpts = require('./less-options')['lessOpts']
lessPath = "../public/javascripts/less"

exports.LessCompiler = class LessCompiler
  constructor: (version, options) ->
    @version = version or __.find lessOpts.lessVersions, (version) ->
      version.type is 'current'
    @options = options or lessOpts.lessOptions
    console.log lessOpts
    @setupVersions(lessOpts.lessVersions)

    return

  setupVersions: (versions) ->
    @versions = []

    for version in versions
      obj = {}
      sub =
        if version.type is 'pre'
          version.label.replace(/[\d\.]+\s\(([\w\d-]+)\)/i, "-$1")
        else ""
      fileName = "less-#{version.number}#{sub}"

      obj.version = version.number
      window = `undefined`
      obj.less = require "#{lessPath}/#{fileName}"

      @versions.push obj

  compile: (version, options) ->
