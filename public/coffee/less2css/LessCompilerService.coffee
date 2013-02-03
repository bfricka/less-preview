l2c.factory 'LessCompiler', [
  '$http', 'LessCache'
  ($http, LessCache) ->
    class LessCompiler
      constructor: ->
        @options =
          saveLess    : true
          lessPath    : "/javascripts/less/less-{version}.js"

        @defaults = _.cloneDeep @options
        @storage = LessCache
        return

      updateOptions: (options) ->
        @lessOptions = options

      loadLess: ->
        opts = @options
        lessOptions = @lessOptions

        version = lessOptions.lessVersion
        version = if version is lessOptions.preRelease then "#{version}-alpha" else version
        scriptUrl = opts.lessPath.replace "{version}", version
        window.less = `undefined`

        getScript = $.ajax
          dataType : "script"
          cache    : true
          url      : scriptUrl

        getScript

      initLess: ->
        @parser = new less.Parser @lessOptions

      compileLess: (lessCode) ->
        try
          compiledCSS = @parseLess lessCode, @lessOptions
          @error = false
          return compiledCSS
        catch lessEx
          @error = true
          return @updateError lessEx

      updateError: (lessEx) ->
        errorText =
        "#{lessEx.type} error: #{lessEx.message}" +
        "\n" +
        (lessEx.extract and lessEx.extract.join and lessEx.extract.join(""))

        errorText

      parseLess: (lessCode) ->
        resultCss = ""

        @parser.parse lessCode, (lessEx, result) ->
          throw lessEx if lessEx

          resultCss = result.toCSS()

        resultCss

    new LessCompiler()
]
