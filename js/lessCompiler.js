var Stor, LessCompiler;

/* Storage wrapper: My preferred way of interacting w/ amplify.store */
Stor = (function() {

  function Stor(key, exp) {
    this.key = key != null ? key : void 0;
    this.exp = exp != null ? exp : null;
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
      return self.amp(key, null);
    });
  };

  return Stor;

})();

LessCompiler = (function() {

  function LessCompiler(elements, options) {
    if (!elements) return;
    this.elements = elements;
    this.editor = CodeMirror.fromTextArea(elements.lessInput[0], {
      theme         : "lesser-dark",
      lineNumbers   : true,
      matchBrackets : true,
      tabSize       : 2
    });

    if (options == null)
      options = {
        lessCDN: "//raw.github.com/cloudhead/less.js/master/dist/less-{version}.js"
        , cdnFallback: "js/less/less-{version}.js"
      };

    this.useFallback = false;

    this.options = options;

  }

  LessCompiler.prototype.setupEvents = function() {
    var self = this;
    var els = this.elements;
    var editor = this.editor;

    this.previousLessCode = editor.getValue();

    els.lessVersion.on('change', function(){
      self.loadLess();
    });

    editor.on('change', function(){
      var lessCode = self.editor.getValue();
      if (self.previousLessCode === lessCode)
        return;

      self.previousLessCode = lessCode;

      self.compileLess();
    });
  };

  LessCompiler.prototype.loadLess = function() {
    var self = this;
    var els = this.elements;
    // Check for fallback to choose correct path
    var path = this.useFallback ? this.options.cdnFallback : this.options.lessCDN;

    els.loadingGif.fadeIn();
    this.editor.options.readOnly = true;

    var version = els.lessVersion.val();
    var scriptUrl = path.replace('{version}', version);

    window.less = undefined;

    var getScript = $.ajax({
      dataType : 'script'
      , cache  : true
      , url    : scriptUrl
    });

    getScript.then(function(){
      // Make sure we have access to less global if we don't try the fallback
      // Uses same-origin hosted files, and prevents mime-type error on IE9+
      // which occurs b/c raw.github serves text/plain
      if (window.less) {
        self.loadComplete.call(self);
      } else {
        // Create a counter to prevent infinite loop on multiple errors
        self.tryCount = self.tryCount ? self.tryCount++ : 1;
        // Switch on fallback URL
        self.useFallback = true;

        if (self.tryCount <= 3)
          self.loadLess();
      }
    });
  };

  LessCompiler.prototype.loadComplete = function() {
    this.parser = new less.Parser({});
    this.editor.options.readOnly = false;
    this.compileLess();
    this.elements.loadingGif.fadeOut();
  };

  LessCompiler.prototype.compileLess = function() {
    var els = this.elements;
    var lessCode = this.editor.getValue();

    try {
      var compiledCSS = this.parseLess(lessCode);
      var highlightedCSS = hljs.highlight('css', compiledCSS).value;
      els.cssCode
        .css('color', '')
        .html(highlightedCSS);
    } catch (lessEx) {
      var errorText = lessEx.type
        + " error: "
        + lessEx.message
        + "\n"
        + (lessEx.extract && lessEx.extract.join(''));

      els.cssCode
        .css('color','red')
        .text(errorText);
    }
  };

  LessCompiler.prototype.parseLess = function(lessCode) {
    var resultCss = "";

    this.parser.parse(lessCode, function(lessEx, result) {
      if (lessEx) throw lessEx;
      resultCss = result.toCSS();
    });

    return resultCss;
  };

  return LessCompiler;
}());

jQuery(function($) {

  var elements = {
    lessVersion  : $('#lessVersion')
    , loadingGif : $('#loadingGif')
    , lessInput  : $('#lessInput')
    , cssCode    : $('#cssOutput')
  };

  var compiler = new LessCompiler(elements);

  compiler.setupEvents();
  compiler.loadLess();
});
