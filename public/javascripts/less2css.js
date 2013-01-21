
/*
Initialize a new `EventEmitter`.

@api public
*/


(function() {
  var EventEmitter, LessCompiler, Stor,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EventEmitter = (function() {

    function EventEmitter() {
      this._callbacks = {};
    }

    /*
      Listen on the given `event` with `fn`.
    
      @param {String} event
      @param {Function} fn
      @return {Emitter}
      @api public
    */


    EventEmitter.prototype.on = function(event, fn) {
      var _base;
      ((_base = this._callbacks)[event] || (_base[event] = [])).push(fn);
      return this;
    };

    /*
      Adds an `event` listener that will be invoked a single
      time then automatically removed.
    
      @param {String} event
      @param {Function} fn
      @return {Emitter}
      @api public
    */


    EventEmitter.prototype.once = function(event, fn) {
      var once,
        _this = this;
      once = function() {
        _this.off(event, once);
        return fn.apply(_this, arguments);
      };
      fn._off = once;
      return this.on(event, once);
    };

    /*
      Remove the given callback for `event` or all
      registered callbacks.
    
      @param {String} event
      @param {Function} fn
      @return {Emitter}
      @api public
    */


    EventEmitter.prototype.off = function(event, fn) {
      var callbacks, i;
      callbacks = this._callbacks[event];
      if (!callbacks) {
        return this;
      }
      if (1 === arguments.length) {
        delete this._callbacks[event];
        return this;
      }
      i = callbacks.indexOf(fn._off || fn);
      if (~i) {
        callbacks.splice(i, 1);
      }
      return this;
    };

    /*
      Emit `event` with the given args.
    
      @param {String} event
      @param {Mixed} ...
      @return {Emitter}
    */


    EventEmitter.prototype.emit = function() {
      var args, callback, callbacks, event, _i, _len, _ref;
      event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      callbacks = this._callbacks[event];
      if (callbacks) {
        _ref = callbacks.slice(0);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          callback = _ref[_i];
          callback.apply(this, args);
        }
      }
      return this;
    };

    /*
      Return array of callbacks for `event`.
    
      @param {String} event
      @return {Array}
      @api public
    */


    EventEmitter.prototype.listeners = function(event) {
      return this._callbacks[event] || [];
    };

    /*
      Check if this emitter has `event` handlers.
    
      @param {String} event
      @return {Boolean}
      @api public
    */


    EventEmitter.prototype.hasListeners = function(event) {
      return !!this.listeners(event).length;
    };

    return EventEmitter;

  })();

  jQuery(function($) {
    var OptionsDrawer;
    OptionsDrawer = (function(_super) {

      __extends(OptionsDrawer, _super);

      function OptionsDrawer(options) {
        var defaults;
        OptionsDrawer.__super__.constructor.call(this);
        defaults = {
          selectors: {
            optsDrawer: "#optionsDrawer",
            toggleBtns: ".toggleBtn",
            toggleChks: ".toggleChk",
            optsForm: "form#optionsDrawerWrap",
            optsBtn: "#optionsButton",
            optsLnk: "#optionsLink",
            nav: "#nav"
          },
          fx: {
            'duration': 500
          },
          text: {
            'optsOpen': 'Close',
            'optsDefault': 'Options'
          }
        };
        this.opts = $.extend(defaults, options);
        this.isOpen = false;
        this.setupEls();
        this.closeDrawer(true);
        this.setupEvents();
        this.updateModel();
        return;
      }

      OptionsDrawer.prototype.setupEls = function() {
        var classes, name, selector, _ref;
        classes = {};
        this.els = {};
        _ref = this.opts.selectors;
        for (name in _ref) {
          selector = _ref[name];
          if (/^\.\w/i.test(selector)) {
            classes[name] = selector;
          } else {
            this.els[name] = $(selector);
          }
        }
        for (name in classes) {
          selector = classes[name];
          this.els[name] = this.els.optsDrawer.find(selector);
        }
        this.els.optsDrawer.find('.hide').hide().removeClass('hide');
      };

      OptionsDrawer.prototype.setupEvents = function() {
        var els, self;
        self = this;
        els = self.els;
        els.optsBtn.on('click', function(e) {
          e.preventDefault();
          if (self.isOpen) {
            return self.closeDrawer.call(self);
          } else {
            return self.openDrawer.call(self, e);
          }
        });
        els.optsLnk.on('click', function(e) {
          e.preventDefault();
          return self.els.optsBtn.trigger('click');
        });
        els.optsForm.on('change', function(e) {
          return self.updateModel.call(self, e);
        });
        els.optsForm.on('submit', function(e) {
          return e.preventDefault();
        });
      };

      OptionsDrawer.prototype.updateModel = function(e) {
        var curr, prev, values;
        if (e == null) {
          e = {};
        }
        prev = this.model || {};
        values = this.els.optsForm.serialize();
        curr = (function() {
          var field, fields, split, _i, _len;
          curr = {};
          fields = values.split('&');
          for (_i = 0, _len = fields.length; _i < _len; _i++) {
            field = fields[_i];
            split = field.split('=');
            curr[split[0]] = split[1] || "";
          }
          return curr;
        })();
        this.emit('change', e, curr, prev);
        return this.model = curr;
      };

      OptionsDrawer.prototype.openDrawer = function(e) {
        var opts, props;
        props = {
          'top': this.els.nav.height(),
          'opacity': 1
        };
        opts = {
          'duration': this.opts.fx.duration
        };
        this.detach();
        this.animateDrawer('open', props, opts);
      };

      OptionsDrawer.prototype.closeDrawer = function(start) {
        var opts, props, self;
        self = this;
        props = {
          'top': -(this.getDrawerTop()),
          'opacity': 0
        };
        opts = {
          'duration': start ? 0 : this.opts.fx.duration
        };
        opts.complete = start ? function() {
          return self.els.optsDrawer.fadeIn();
        } : undefined;
        this.animateDrawer('close', props, opts);
      };

      OptionsDrawer.prototype.animateDrawer = function(action, props, opts) {
        var cb, defer, optsDrawer, self;
        self = this;
        optsDrawer = this.els.optsDrawer;
        defer = new $.Deferred();
        cb = opts.complete || function() {};
        opts.complete = function() {
          defer.resolve();
          return cb.apply(self, arguments);
        };
        optsDrawer.animate(props, opts);
        defer.done(function() {
          if (action === 'close') {
            return self.onClose.call(self);
          } else {
            return self.onOpen.call(self);
          }
        });
      };

      OptionsDrawer.prototype.onOpen = function() {
        this.isOpen = true;
      };

      OptionsDrawer.prototype.onClose = function() {
        this.attach();
        this.isOpen = false;
      };

      OptionsDrawer.prototype.getDrawerTop = function() {
        return this.els.optsDrawer.outerHeight() - this.els.nav.height();
      };

      OptionsDrawer.prototype.getBtnLeft = function() {
        var btn;
        btn = this.els.optsBtn[0];
        return btn.parentElement.offsetLeft + btn.parentElement.parentElement.offsetLeft;
      };

      OptionsDrawer.prototype.attach = function() {
        this.els.optsBtn.insertAfter(this.els.optsLnk);
        this.els.optsBtn.removeClass('active')[0].style.cssText = "";
      };

      OptionsDrawer.prototype.detach = function() {
        var els, left, optsBtn, wid;
        els = this.els;
        optsBtn = els.optsBtn;
        wid = optsBtn.width();
        left = this.getBtnLeft();
        els.optsBtn.css({
          'left': left,
          'width': wid
        }).addClass('active');
        this.els.optsBtn.appendTo(this.els.optsForm);
      };

      return OptionsDrawer;

    })(EventEmitter);
    return $.fn.OptionsDrawer = OptionsDrawer;
  });

  Stor = (function() {

    function Stor(key, exp) {
      this.key = (key != null ? key : void 0);
      this.exp = (exp != null ? exp : null);
      this.amp = amplify.store;
    }

    Stor.prototype.get = function(key) {
      if (key == null) {
        key = this.key;
      }
      return this.amp(key);
    };

    Stor.prototype.set = function(val, key, exp) {
      if (key == null) {
        key = this.key;
      }
      if (exp == null) {
        exp = this.exp;
      }
      return this.amp(key, val, exp);
    };

    Stor.prototype.remove = function(key) {
      if (key == null) {
        key = this.key;
      }
      return this.amp(key, null);
    };

    Stor.prototype.empty = function() {
      var self, storage;
      self = this;
      storage = self.amp();
      return $.each(storage, function(itm, key) {
        self.amp(key, null);
      });
    };

    return Stor;

  })();

  LessCompiler = (function() {

    function LessCompiler(elements, options) {
      var defaults;
      if (!elements) {
        return;
      }
      this.elements = elements;
      this.editor = CodeMirror.fromTextArea(elements.lessInput[0], {
        theme: "lesser-dark",
        lineNumbers: true,
        matchBrackets: true,
        tabSize: 2
      });
      defaults = {
        cdnFallback: "js/less/less-{version}.js",
        useFallback: false,
        saveLess: true,
        lessCDN: "//raw.github.com/cloudhead/less.js/master/dist/less-{version}.js",
        lessOptions: {
          dumpLineNumbers: false,
          relativeUrls: false,
          rootpath: false
        }
      };
      this.options = $.extend(defaults, options);
      this.storage = new Stor("lessCode");
      this.setupDrawer();
      return;
    }

    LessCompiler.prototype.updateOptions = function(model) {
      var opts;
      return opts = this.options.lessOptions;
    };

    LessCompiler.prototype.setupDrawer = function() {
      var drawer, els;
      drawer = new $.fn.OptionsDrawer();
      els = drawer.els;
      els.toggleBtns.on('click', function(e) {
        var btn, checked, chk, idx;
        idx = els.toggleBtns.index(this);
        chk = els.toggleChks.eq(idx);
        btn = $(this);
        chk.trigger('click');
        checked = chk.is(':checked');
        if (checked) {
          btn.addClass('btn-primary').text('Enabled').siblings(':disabled').addClass('enabled').fadeIn().attr('disabled', false).trigger('change');
        } else {
          btn.removeClass('btn-primary').text('Disabled').siblings('.enabled').fadeOut().attr('disabled', true).trigger('change');
        }
      });
      this.drawer = drawer;
      return this;
    };

    LessCompiler.prototype.setupEvents = function() {
      var cachedLess, editor, els, self, versionOpts;
      self = this;
      els = this.elements;
      editor = this.editor;
      cachedLess = this.storage.get();
      versionOpts = els.lessVersion.find('option');
      if (cachedLess) {
        editor.setValue(cachedLess);
        this.previousLessCode = cachedLess;
      } else {
        this.previousLessCode = editor.getValue();
      }
      this.drawer.on('change', function(e, model) {
        var field, fieldName, preRelease;
        field = $(e.target);
        fieldName = field.attr('name');
        if (fieldName === 'lessVersion') {
          preRelease = field.find('option').filter(':selected').is('[data-prerelease=true]') ? true : false;
          self.loadLess(preRelease);
        } else {
          self.updateOptions(model);
          self.loadLess();
        }
        return console.log(model);
      });
      editor.on("change", function() {
        var lessCode;
        lessCode = self.editor.getValue();
        if (self.previousLessCode === lessCode) {
          return;
        }
        self.previousLessCode = lessCode;
        self.compileLess();
      });
      return this;
    };

    LessCompiler.prototype.loadLess = function(preRelease) {
      var els, getScript, opts, path, scriptUrl, self, version;
      self = this;
      opts = this.options;
      els = this.elements;
      path = opts.useFallback ? opts.cdnFallback : opts.lessCDN;
      els.loadingGif.fadeIn();
      this.editor.options.readOnly = true;
      version = els.lessVersion.val();
      version = preRelease ? "" + version + "-alpha" : version;
      scriptUrl = path.replace("{version}", version);
      window.less = undefined;
      getScript = $.ajax({
        dataType: "script",
        cache: true,
        url: scriptUrl
      });
      getScript.then(function() {
        if (window.less) {
          self.loadComplete.call(self);
        } else {
          self.tryCount = self.tryCount ? self.tryCount++ : 1;
          self.options.useFallback = true;
          if (self.tryCount <= 3) {
            self.loadLess();
          }
        }
      });
      return this;
    };

    LessCompiler.prototype.loadComplete = function() {
      this.parser = new less.Parser(this.options.lessOptions);
      this.editor.options.readOnly = false;
      this.compileLess();
      this.elements.loadingGif.fadeOut();
      return this;
    };

    LessCompiler.prototype.compileLess = function() {
      var compiledCSS, lessCode;
      lessCode = this.editor.getValue();
      if (this.options.saveLess) {
        this.storage.set(lessCode);
      }
      try {
        compiledCSS = this.parseLess(lessCode);
        this.updateCSS(compiledCSS);
      } catch (lessEx) {
        this.updateError(lessEx);
      }
      return this;
    };

    LessCompiler.prototype.updateCSS = function(compiledCSS) {
      var highlightedCSS;
      highlightedCSS = hljs.highlight("css", compiledCSS).value;
      this.elements.cssCode.css("color", "").html(highlightedCSS);
      return this;
    };

    LessCompiler.prototype.updateError = function(lessEx) {
      var errorText;
      errorText = ("" + lessEx.type + " error: " + lessEx.message) + "\n" + (lessEx.extract && lessEx.extract.join && lessEx.extract.join(""));
      this.elements.cssCode.css("color", "red").text(errorText);
      return this;
    };

    LessCompiler.prototype.parseLess = function(lessCode) {
      var resultCss;
      resultCss = "";
      this.parser.parse(lessCode, function(lessEx, result) {
        if (lessEx) {
          throw lessEx;
        }
        return resultCss = result.toCSS();
      });
      return resultCss;
    };

    return LessCompiler;

  })();

  jQuery(function($) {
    var compiler, elements;
    elements = {
      lessVersion: $("#lessVersion"),
      loadingGif: $("#loadingGif"),
      lessInput: $("#lessInput"),
      cssCode: $("#cssOutput")
    };
    compiler = window.comp = new LessCompiler(elements);
    return compiler.setupEvents().loadLess();
  });

}).call(this);
