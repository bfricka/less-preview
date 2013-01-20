# Storage wrapper: My preferred way of interacting w/ amplify.store
class Stor

  constructor: (key, exp) ->
    @key = (if key? then key else undefined)
    @exp = (if exp? then exp else null)
    @amp = amplify.store

  get: (key = @key) ->
    @amp key

  set: (val, key = @key, exp = @exp) ->
    @amp key, val, exp

  remove: (key = @key) ->
    @amp key, null

  empty: ->
    self = this
    storage = self.amp()
    $.each storage, (itm, key) ->
      self.amp key, null
      return

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

    @options = $.extend defaults, options
    @storage = new Stor "lessCode"
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

    els.lessVersion.on "change", ->
      preRelease = if versionOpts
        .filter(':selected')
        .is('[data-prerelease=true]') then true else false
      self.loadLess(preRelease)

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
    @parser = new less.Parser({})
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

  drawer =
    els:
      optsDrawer : $("#optionsDrawer")
      optsWrap   : $("#optionsDrawerWrap")
      optsBtn    : $("#optionsButton")
      optsLnk    : $("#optionsLink")
      nav        : $("#nav")

    fx:
      'duration': 500

    text:
      'optsOpen'    : 'Close'
      'optsDefault' : 'Options'

    isOpen: false

    init: ->
      @els.toggleBtns = @els.optsWrap.find('.toggleBtn')
      @els.toggleChks = @els.optsWrap.find('.toggleChk')

      @closeDrawer(true)
      @setupEvents()
      # @detach()

    setupEvents: ->
      self = @
      @els.optsBtn.on 'click', (e) ->
        e.preventDefault()

        if self.isOpen
          self.closeDrawer.call(self)
        else
          self.openDrawer.call(self, e)

    openDrawer: (e) ->
      props =
        'top'   : @els.nav.height()
        'opacity'  : 1

      opts =
        'duration' : @fx.duration

      @detach()
      @animateDrawer('open', props, opts)

    closeDrawer: (start) ->
      self = @
      props =
        'top'   : -(@getDrawerHt())
        'opacity'  : 0

      opts =
        'duration' : if start then 0 else @fx.duration

      opts.complete = if start then -> self.els.optsDrawer.fadeIn() else `undefined`

      @animateDrawer('close', props, opts)

    animateDrawer: (action, props, opts) ->
      self = @
      optsDrawer = @els.optsDrawer
      defer = new $.Deferred()
      cb = opts.complete or ->

      opts.complete = ->
        defer.resolve()
        cb.apply(self, arguments)

      optsDrawer.animate props, opts

      defer.done ->
        if action is 'close'
          self.onClose.call(self)
        else
          self.onOpen.call(self)

    onOpen: ->
      @isOpen = true

    onClose: ->
      @attach()
      @isOpen = false

    getDrawerHt: ->
      @els.optsDrawer.outerHeight() - @els.nav.height()

    getBtnLeft: ->
      btn = @els.optsBtn[0]
      btn.parentElement.offsetLeft + btn.parentElement.parentElement.offsetLeft

    attach: ->
      @els.optsBtn.insertAfter @els.optsLnk
      @els.optsBtn.removeClass('active')[0].style.cssText = ""


    detach: ->
      els = @els
      optsBtn = els.optsBtn
      wid = optsBtn.width()
      left = @getBtnLeft()

      els.optsBtn.css
        'left': left
        'width': wid
      .addClass 'active'

      @els.optsBtn.appendTo @els.optsWrap

  drawer.init()

  compiler = window.comp = new LessCompiler(elements)

  compiler
  .setupEvents()
  .loadLess()
