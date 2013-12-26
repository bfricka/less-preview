angular
.module('Less2Css')
.factory('LessCompiler', [
  'Stor'
  , 'LessLoader'
  , function(Stor, LessLoader) {
    var LessEditorCache = new Stor('LessEditorCache');

    function LessCompiler() {
      this.options = { saveLess : true };
      this.storage = LessEditorCache;
    }

    LessCompiler.prototype = {
      /**
       * Creates the parser
       * @return {void}
       */
      initLess: function() {
        this.parser = new less.Parser(this.lessOptions);
      }

      /**
       * Tries to compile the less input
       * @param  {String} lessCode input string of less code
       * @return {String}          Either the compiled less or error text
       */
      , compileLess: function(lessCode) {
        if (!this.parser) return "";

        try {
          var compiledCSS = this.parseLess(lessCode, this.lessOptions);
          this.error = false;
          this.storage.set(lessCode);
          return compiledCSS;
        } catch (lessEx) {
          this.error = true;
          if (lessEx.type.toLowerCase() === 'file') this.initLess();
          return this.updateError(lessEx);
        }
      }

      /**
       * Runs toCSS on the compiled tree (or throws the lessEx error)
       * @param  {String} lessCode LESS input string
       * @return {String}          CSS Result
       */
      , parseLess: function(lessCode) {
        var lessOptions = this.lessOptions;
        var resultCss = "";

        this.parser.parse(lessCode, function(lessEx, result) {
          if (lessEx) throw lessEx;
          resultCss = result.toCSS(lessOptions);
        });

        return resultCss;
      }

      /**
       * Updates the options and re-initializes less with the new ones
       * @param  {Object} options Options object
       * @return {void}
       */
      , updateOptions: function(options) {
        this.lessOptions = options;
        if (LessLoader.isLoaded()) this.initLess();
      }

      /**
       * Takes the thrown exception and returns formatted error text
       * @param  {Object} lessEx LESS Exception object
       * @return {String}        String readable version of error text
       */
      , updateError: function(lessEx) {
        var errorText = (lessEx.type + ' error: ' + lessEx.message) + '\n' + (lessEx.extract && lessEx.extract.join && lessEx.extract.join(''));
        return errorText;
      }

      , getCache: function() {
        return this.storage.get();
      }
    };

    return new LessCompiler();
  }
]);
