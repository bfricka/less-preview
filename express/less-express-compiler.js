(function() {
  var LessCompiler, lessOpts, lessPath, __;

  __ = require('lodash');

  lessOpts = require('./less-options')['lessOpts'];

  lessPath = "../public/javascripts/less";

  exports.LessCompiler = LessCompiler = (function() {

    function LessCompiler(version, options) {
      this.version = version || __.find(lessOpts.lessVersions, function(version) {
        return version.type === 'current';
      });
      this.options = options || lessOpts.lessOptions;
      console.log(lessOpts);
      this.setupVersions(lessOpts.lessVersions);
      return;
    }

    LessCompiler.prototype.setupVersions = function(versions) {
      var fileName, obj, sub, version, window, _i, _len, _results;
      this.versions = [];
      _results = [];
      for (_i = 0, _len = versions.length; _i < _len; _i++) {
        version = versions[_i];
        obj = {};
        sub = version.type === 'pre' ? version.label.replace(/[\d\.]+\s\(([\w\d-]+)\)/i, "-$1") : "";
        fileName = "less-" + version.number + sub;
        obj.version = version.number;
        window = undefined;
        obj.less = require("" + lessPath + "/" + fileName);
        _results.push(this.versions.push(obj));
      }
      return _results;
    };

    LessCompiler.prototype.compile = function(version, options) {};

    return LessCompiler;

  })();

}).call(this);
