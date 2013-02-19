# Simple open/close for drawer - no need to Angularize
jQuery ($) ->
  class OptionsDrawer
    constructor: ->
      @els =
        lessOptions : $('#less-options')
        optsDrawer  : $('#options-drawer')
        optsWrap    : $('#options-drawer-wrap')
        optsBtn     : $('#options-button')
        optsLnk     : $('#options-link')
        nav         : $('#nav')
      @fx =
        'duration': 300
      @text =
        'optsOpen'    : 'Close'
        'optsDefault' : 'Options'

      @isOpen = false

      @closeDrawer(true)
      @setupEvents()

    setupEvents: ->
      self = @
      els = self.els

      els.optsBtn.on 'click', (e) ->
        e.preventDefault()

        if self.isOpen
          self.closeDrawer.call(self)
        else
          self.openDrawer.call(self)

        return

      els.optsLnk.on 'click', (e) ->
        e.preventDefault()
        els.optsBtn.trigger 'click'

        return

      return

    openDrawer: ->
      @els.lessOptions.addClass 'open'

      props =
        'top'     : @els.nav.height()
        'opacity' : 1
      opts =
        'duration': @fx.duration

      @detach()
      @animateDrawer 'open', props, opts

      return

    closeDrawer: (start) ->
      els = @els

      els.lessOptions.removeClass 'open'
      props =
        'top'     : -(@getDrawerTop())
        'opacity' : 0

      opts =
        'duration' : if start then 0 else @fx.duration

      opts.complete = if start then -> els.optsDrawer.fadeIn() else `undefined`

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

      @els.optsBtn.appendTo @els.optsWrap
      return

  optsDrawer = new OptionsDrawer()