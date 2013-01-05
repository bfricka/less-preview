window.LessCompiler = (function() {
  LessCompiler.name = "LessCompiler";
  function LessCompiler(elements, options) {
    if (!elements) return;
    this.elements = elements;

    if (options == null)
      options = { lessCDN: "//raw.github.com/cloudhead/less.js/master/dist/less-{version}.js" };

    this.options = options;
  }
  return LessCompiler;
}());

LessCompiler.prototype.setupEvents = function() {
  var self = this;
  var els = this.elements;
  var previousLessCode = els.lessInput.val();

  els.lessVersion.on('change', function(){
    self.loadLess();
  });

  els.lessInput.on('change keyup input paste cut copy', function() {
    var lessCode = els.lessInput.val();
    if (previousLessCode === lessCode)
      return;

    previousLessCode = lessCode;

    self.compileLess();
  });
};

LessCompiler.prototype.loadLess = function() {
  var self = this;
  var els = this.elements;

  els.lessInput.attr('disabled', true);

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
      els.lessInput.attr('disabled', false);
      self.compileLess();
    });
};

LessCompiler.prototype.compileLess = function() {
  var els = this.elements;
  var lessCode = els.lessInput.val();

  try {
    var compiledCSS = this.parseLess(lessCode);
    els.cssCode
      .css('color', '')
      .text(compiledCSS);
  } catch (lessEx) {
    var errorText = lessEx.type
      +" error: "
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

  var compiler = new LessCompiler(elements);

  compiler.setupEvents();
  compiler.loadLess();
});
