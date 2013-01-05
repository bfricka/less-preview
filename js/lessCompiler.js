window.LessCompiler = (function() {
  LessCompiler.name = "LessCompiler";
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
      options = { lessCDN: "//raw.github.com/cloudhead/less.js/master/dist/less-{version}.js" };

    this.options = options;

  }
  return LessCompiler;
}());

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

  this.editor.options.readOnly = true;

  var version = els.lessVersion.val();
  var scriptUrl = this.options.lessCDN.replace('{version}', version);

  window.less = undefined;

  $.ajax({
    dataType : 'script'
    , cache  : true
    , url    : scriptUrl
  })
    .then(function(){
      self.parser = new less.Parser({});
      self.editor.options.readOnly = false;
      self.compileLess();
    });
};

LessCompiler.prototype.compileLess = function() {
  var els = this.elements;
  var lessCode = this.editor.getValue();

  try {
    var compiledCSS = this.parseLess(lessCode);
    els.cssCode
      .css('color', '')
      .text(compiledCSS);
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

jQuery(function($) {

  var elements = {
    lessVersion : $('#lessVersion')
    , lessInput : $('#lessInput')
    , cssCode   : $('#cssOutput')
  };

  window.compiler = new LessCompiler(elements);

  compiler.setupEvents();
  compiler.loadLess();
});
