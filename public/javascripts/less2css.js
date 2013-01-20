var LessCompiler, Stor;

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
      lessCDN: "//raw.github.com/cloudhead/less.js/master/dist/less-{version}.js"
    };
    this.options = $.extend(defaults, options);
    this.storage = new Stor("lessCode");
    return;
  }

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
    els.lessVersion.on("change", function() {
      var preRelease;
      preRelease = versionOpts.filter(':selected').is('[data-prerelease=true]') ? true : false;
      return self.loadLess(preRelease);
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
    this.parser = new less.Parser({});
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
  var compiler, drawer, elements;
  elements = {
    lessVersion: $("#lessVersion"),
    loadingGif: $("#loadingGif"),
    lessInput: $("#lessInput"),
    cssCode: $("#cssOutput")
  };
  drawer = {
    els: {
      optsWrap: $("#optionsDrawerWrap").addClass('closed'),
      optsBtn: $("#optionsButton"),
      optsLnk: $("#optionsLink")
    },
    init: function() {
      this.els.toggleBtns = this.els.optsWrap.find('.toggleBtn');
      this.els.toggleChks = this.els.optsWrap.find('.toggleChk');
      this.setupEvents();
      return this.detach();
    },
    setupEvents: function() {},
    onOpen: function() {},
    getBtnLeft: function() {
      var btn;
      btn = this.els.optsBtn[0];
      return btn.parentElement.offsetLeft + btn.parentElement.parentElement.offsetLeft;
    },
    detach: function() {
      var els, left, optsBtn, wid;
      els = this.els;
      optsBtn = els.optsBtn;
      wid = optsBtn.width();
      left = this.getBtnLeft();
      els.optsBtn.css({
        'left': left,
        'width': wid
      }).addClass('active');
      return this.els.optsBtn.appendTo(this.els.optsWrap);
    }
  };
  drawer.init();
  compiler = window.comp = new LessCompiler(elements);
  return compiler.setupEvents().loadLess();
});
