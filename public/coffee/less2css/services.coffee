l2c.factory 'LessCompiler', ->
  class LessCompiler
    constructor: ->
      @options =
        useFallback : false
        saveLess    : true
        lessPath    : "/javascripts/less/less-{version}.js"
        lessOptions :
          dumpLineNumbers : false
          relativeUrls    : false
          rootpath        : false
          filename        : 'less2css.org.less'

      @defaults = _.cloneDeep @options
      return

    updateOptions: (model) ->
      opts = @options.lessOptions

      for prop, val of opts
        opts[prop] = if model.hasOwnProperty(prop) then model[prop] else @defaults.lessOptions[prop]

      return

    setupEvents: ->
      self = this
      els = @elements
      editor = @editor
      cachedLess = @storage.get()
      versionOpts = els.lessVersion.find('option')

      # If we have cached LESS, set it. Otherwise, set previous
      # to current value of editor (from textarea default)
      if cachedLess
        editor.setValue cachedLess
        @previousLessCode = cachedLess
      else
        @previousLessCode = editor.getValue()

      # Wait for drawer options to change
      @drawer.on 'change', (e, model) ->
        field = $(e.target)

        fieldName = field.attr 'name'

        if fieldName is 'lessVersion'
          preRelease = if field.find('option')
            .filter(':selected')
            .is('[data-prerelease=true]') then true else false
          self.loadLess(preRelease)

        else
          self.updateOptions model
          self.loadComplete.call self

        console.log model

      editor.on "change", ->
        lessCode = self.editor.getValue()

        return if self.previousLessCode is lessCode

        self.previousLessCode = lessCode
        self.compileLess()
        return
      @

    loadLess: (preRelease) ->
      self = this
      opts = @options
      els  = @elements

      # Check for fallback to choose correct path
      # path = if opts.useFallback then opts.cdnFallback else opts.lessCDN

      els.loadingGif.fadeIn()

      @editor.options.readOnly = true

      version     = els.lessVersion.val()
      version     = if preRelease then "#{version}-alpha" else version
      scriptUrl   = opts.lessPath.replace "{version}", version
      window.less = `undefined`

      getScript = $.ajax
        dataType : "script"
        cache    : true
        url      : scriptUrl

      getScript.done ->
        self.loadComplete.call self
        return
      @

    loadComplete: ->
      @parser = new less.Parser(@options.lessOptions)
      @editor.options.readOnly = false

      @compileLess()
      @elements.loadingGif.fadeOut()

      @

    compileLess: ->
      lessCode = @editor.getValue()

      # Cache input less
      @storage.set(lessCode) if @options.saveLess

      try
        compiledCSS = @parseLess(lessCode)
        @updateCSS compiledCSS
      catch lessEx
        @updateError lessEx

      @

    updateCSS: (compiledCSS) ->
      highlightedCSS = hljs.highlight("css", compiledCSS).value
      @elements.cssCode.css("color", "").html highlightedCSS

      @

    updateError: (lessEx) ->
      errorText =
      "#{lessEx.type} error: #{lessEx.message}" +
      "\n" +
      (lessEx.extract and lessEx.extract.join and lessEx.extract.join(""))

      @elements.cssCode.css("color", "red").text errorText

      @

    parseLess: (lessCode) ->
      resultCss = ""

      @parser.parse lessCode, (lessEx, result) ->
        throw lessEx if lessEx

        resultCss = result.toCSS()

      resultCss

  jQuery ($) ->
    elements =
      lessVersion : $("#lessVersion")
      loadingGif  : $("#loadingGif")
      lessInput   : $("#lessInput")
      cssCode     : $("#cssOutput")

    compiler = window.comp =  new LessCompiler(elements)

    compiler
    .setupEvents()
    .loadLess()

  new LessCompiler()
