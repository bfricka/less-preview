class LessCompiler

  constructor: (elements, options) ->
    return unless elements

    @elements = elements
    @editor = CodeMirror.fromTextArea(elements.lessInput[0],
      theme: "lesser-dark"
      lineNumbers: true
      matchBrackets: true
      tabSize: 2
    )

    defaults =
      cdnFallback : "js/less/less-{version}.js"
      useFallback : false
      saveLess    : true
      lessCDN     : "//raw.github.com/cloudhead/less.js/master/dist/less-{version}.js"
      lessOptions :
        dumpLineNumbers : false
        relativeUrls    : false
        rootpath        : false

    # Create behavior beyond the scope of optionsDrawer impl
    @options = $.extend defaults, options
    @storage = new Stor "lessCode"

    @setupDrawer()
    return

  updateOptions: (model) ->
    opts = @options.lessOptions

    # if model.toggleDumpLines

  setupDrawer: ->
    self = @
    drawer = new $.fn.OptionsDrawer()
    els = drawer.els

    # Toggle buttons aka pseudo-checkbox
    els.toggleBtns.on 'click', (e) ->
      e.stopImmediatePropagation() # May not be required

      # Every toggleBtn has a hidden check so we can use index
      # to sync the two
      idx = els.toggleBtns.index(@)
      chk = els.toggleChks.eq(idx)
      btn = $(@)

      if not chk.is ':checked'
        self.drawerBtnToggleOn(btn, chk)
      else
        self.drawerBtnToggleOff(btn, chk)


      return

    @drawer = drawer
    @

  drawerBtnToggleOn: (btn, chk) ->
    # Check the real checkbox
    chk.prop 'checked', true

    # Add UI stuff for checked state
    btn
      .addClass('btn-primary')
      .text('Enabled')

    # Check for any hidden disabled elements that are
    # siblings (elements dependent on a check being true/false)
    disabled = btn.siblings(':disabled')

    # If we have a hidden disabled element, enable it, etc.
    # Resolve all by triggering change event
    if disabled.length
      disabled
        .addClass('enabled')
        .fadeIn()
        .prop('disabled', false)
        .trigger('change')
    else
      chk.trigger 'change'

    return

  drawerBtnToggleOff: (btn, chk) ->
    chk.prop 'checked', false
    btn
      .removeClass('btn-primary')
      .text('Disabled')

    enabled = btn.siblings('.enabled')

    if enabled.length
      enabled
        .fadeOut()
        .prop('disabled', true)
        .trigger('change')
    else
      chk.trigger 'change'

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
        self.loadLess()

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
    path = if opts.useFallback then opts.cdnFallback else opts.lessCDN

    els.loadingGif.fadeIn()

    @editor.options.readOnly = true

    version     = els.lessVersion.val()
    version     = if preRelease then "#{version}-alpha" else version
    scriptUrl   = path.replace "{version}", version
    window.less = `undefined`

    getScript = $.ajax
      dataType : "script"
      cache    : true
      url      : scriptUrl

    getScript.then ->
      # Make sure we have access to less global if we don't try the fallback
      # Uses same-origin hosted files, and prevents mime-type error on IE9+
      # which occurs b/c raw.github serves text/plain
      if window.less
        self.loadComplete.call self
      else
        # Create a counter to prevent infinite loop on multiple errors
        self.tryCount = if self.tryCount then self.tryCount++ else 1

        # Switch on fallback URL
        self.options.useFallback = true
        self.loadLess() if self.tryCount <= 3
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
