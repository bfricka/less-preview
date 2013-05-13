jQuery(function($) {
  var OptionsDrawer = (function() {

    OptionsDrawer.name = 'OptionsDrawer';

    function OptionsDrawer() {
      this.els = {
          nav: $('#nav')
        , optsLnk: $('#options-link')
        , optsBtn: $('#options-button')
        , optsWrap: $('#options-drawer-wrap')
        , optsDrawer: $('#options-drawer')
        , lessOptions: $('#less-options')
      };

      this.fx = { 'duration': 300 };

      this.text = {
        'optsOpen': 'Close',
        'optsDefault': 'Options'
      };

      this.isOpen = false;
      this.closeDrawer(true);
      this.setupEvents();
    }

    OptionsDrawer.prototype = {
      setupEvents: function() {
        var self = this
          , els = self.els;

        els.optsBtn.on('click', function(e) {
          e.preventDefault();
          self.isOpen
            ? self.closeDrawer.call(self)
            : self.openDrawer.call(self);
        });

        els.optsLnk.on('click', function(e) {
          e.preventDefault();
          els.optsBtn.trigger('click');
        });
      }

      , openDrawer: function() {
        var props = { 'top': this.els.nav.height(), 'opacity': 1 }
          , opts = { 'duration': this.fx.duration };

        this.els.lessOptions.addClass('open');
        this.detach();
        this.animateDrawer('open', props, opts);
      }

      , closeDrawer: function(start) {
        var els = this.els
          , props = { 'top': -(this.getDrawerTop()), 'opacity': 0 }
          , opts = { 'duration': start ? 0 : this.fx.duration };

        els.lessOptions.removeClass('open');

        opts.complete = start ? function() {
          els.optsDrawer.fadeIn();
        } : undefined;

        this.animateDrawer('close', props, opts);
      }

      , animateDrawer: function(action, props, opts) {
        var self = this
          , optsDrawer = this.els.optsDrawer
          , defer = new $.Deferred()
          , cb = opts.complete || function() {};

        opts.complete = function() {
          defer.resolve();
          return cb.apply(self, arguments);
        };

        optsDrawer.animate(props, opts);
        defer.done(function() {
          (action === 'close')
            ? self.onClose.call(self)
            : self.onOpen.call(self);
        });
      }

      , getDrawerTop: function() {
        return this.els.optsDrawer.outerHeight() - this.els.nav.height();
      }

      , getBtnLeft: function() {
        var btn = this.els.optsBtn[0];
        return btn.parentElement.offsetLeft + btn.parentElement.parentElement.offsetLeft;
      }

      , attach: function() {
        this.els.optsBtn.insertAfter(this.els.optsLnk);
        this.els.optsBtn.removeClass('active')[0].style.cssText = "";
      }

      , detach: function() {
        var els = this.els
          , optsBtn = els.optsBtn
          , wid = optsBtn.width()
          , left = this.getBtnLeft();

        els.optsBtn
          .css({ 'left': left, 'width': wid })
          .addClass('active');

        this.els.optsBtn.appendTo(this.els.optsWrap);
      }

      , onOpen: function() { this.isOpen = true; }
      , onClose: function() { this.attach(); this.isOpen = false; }
    };

    return OptionsDrawer;

  })();
  return new OptionsDrawer();
});
