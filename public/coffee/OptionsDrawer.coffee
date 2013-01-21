jQuery ($) ->
  class OptionsDrawer extends EventEmitter

    constructor: (options) ->
      # Call super to get instance variables of EE constructor
      # i.e. _callbacks object
      super()

      defaults =
        selectors:
          optsDrawer : "#optionsDrawer"
          toggleBtns : ".toggleBtn"
          toggleChks : ".toggleChk"
          optsForm   : "form#optionsDrawerWrap"
          optsBtn    : "#optionsButton"
          optsLnk    : "#optionsLink"
          nav        : "#nav"

        fx:
          'duration': 500

        text:
          'optsOpen'    : 'Close'
          'optsDefault' : 'Options'

      @opts = $.extend defaults, options
      @isOpen = false

      @setupEls()
      @closeDrawer(true)
      @setupEvents()
      @updateModel()
      return

    setupEls: ->
      classes = {}
      @els = {}
      for name, selector of @opts.selectors
        if /^\.\w/i.test selector
          classes[name] = selector
        else
          @els[name] = $(selector)

      for name, selector of classes
        @els[name] = @els.optsDrawer.find(selector)

      return

    setupEvents: ->
      self = @
      els = self.els

      els.optsBtn.on 'click', (e) ->
        e.preventDefault()

        if self.isOpen
          self.closeDrawer.call(self)
        else
          self.openDrawer.call(self, e)

      els.optsLnk.on 'click', (e) ->
        e.preventDefault()
        self.els.optsBtn.trigger 'click'

      els.optsForm.on 'change', (e) ->
        self.updateModel.call(self, e)

      els.optsForm.on 'submit', (e) ->
        e.preventDefault()

      return

    updateModel: (e = {}) ->
      prev = @model or {}
      values = @els.optsForm.serialize()

      curr = do ->
        curr = {}
        fields = values.split '&'

        for field in fields
          split = field.split '='
          curr[split[0]] = split[1] or ""

        curr

      @emit 'change', e, curr, prev

      @model = curr

    openDrawer: (e) ->
      props =
        'top'     : @els.nav.height()
        'opacity' : 1

      opts =
        'duration' : @opts.fx.duration

      @detach()
      @animateDrawer 'open', props, opts
      return

    closeDrawer: (start) ->
      self = @
      props =
        'top'     : -(@getDrawerTop())
        'opacity' : 0

      opts =
        'duration' : if start then 0 else @opts.fx.duration

      opts.complete = if start then -> self.els.optsDrawer.fadeIn() else `undefined`

      @animateDrawer 'close', props, opts
      return

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

      return

    onOpen: ->
      @isOpen = true
      return

    onClose: ->
      @attach()
      @isOpen = false
      return

    getDrawerTop: ->
      @els.optsDrawer.outerHeight() - @els.nav.height()

    getBtnLeft: ->
      btn = @els.optsBtn[0]
      btn.parentElement.offsetLeft + btn.parentElement.parentElement.offsetLeft

    attach: ->
      @els.optsBtn.insertAfter @els.optsLnk
      @els.optsBtn.removeClass('active')[0].style.cssText = ""
      return

    detach: ->
      els = @els
      optsBtn = els.optsBtn
      wid = optsBtn.width()
      left = @getBtnLeft()

      els.optsBtn.css
        'left': left
        'width': wid
      .addClass 'active'

      @els.optsBtn.appendTo @els.optsForm
      return

  $.fn.OptionsDrawer = OptionsDrawer