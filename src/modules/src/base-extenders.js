/* jshint eqeqeq:false */

(function() {
  // Extend the prototype of Function w/ bind if it doesn't exist
  if (!Function.prototype.bind) {
    var slice = function(obj, fromIndex, toIndex) {
      return Array.prototype.slice.call(obj, fromIndex, toIndex);
    };

    _.extend(Function.prototype, {
      bind: function (oThis) {
        if (typeof this !== 'function') {
          throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var fnArgs = slice(arguments, 1);
        var fnToBind = this;

        function fnNoop() {}
        function fnBound() {
          return fnToBind.apply(this instanceof fnNoop && oThis ? this : oThis, fnArgs);
        }

        fnNoop.prototype = this.prototype;
        fnBound.prototype = new fnNoop();

        return fnBound;
      }
    });
  }

  // Element helpers
  _.extend(Element.prototype, {
    getComputedStyle: function(style) {
      var styles = window.getComputedStyle(this);
      return styles[style];
    },

    hasClosestEl: function(el) {
      var currentEl = this;

      while (currentEl.parentElement) {
        if (currentEl === el) return true;
        currentEl = currentEl.parentElement;
      }

      return false;
    },

    getClosest: function(classname) {
      var el = this;

      while(el.parentElement) {
        if (angular.element(el).hasClass(classname))
          return el;

        el = el.parentElement;
      }

      return null;
    },

    getTop: function() {
      var top = this.offsetTop;
      var parent = this.offsetParent;

      while (parent) {
        top += parent.offsetTop;
        parent = parent.offsetParent;
      }

      return top;
    },

    childElements: function(selector) {
      var els = this.querySelectorAll(selector);
      var children = _.toArray(this.children);
      var childElements = [];
      var len = els.length;
      var i = 0;
      var el;

      while (i < len) {
        el = els[i];
        if (children.indexOf(el) !== -1) childElements.push(el);
        i++;
      }

      return childElements.length ? childElements : null;
    }
  });

  var SPACES_REGEX = /\s+/;
  var WORDS_REGEX = /\S+/;

  var x_str_proto = {

    /**
     * Capitalizes the first letter in a string
     *
     * @example
     *   "welcome to the jungle!".capitalize();
     *   // "Welcome to the jungle!"
     *
     * @return {String} Captitalized string
     */
    capitalize: function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    },

    /**
     * Capitalizes each word
     *
     * @example
     *   "i, a universe of atoms, an atom in the universe".titlecase();
     *   // "I, A Universe Of Atoms, An Atom In The Universe"
     *
     * @return {string} Title cased string
     */
    titlecase: function() {
      var self = this.trim();
      var words = self.split(SPACES_REGEX);
      var len = words.length;

      if (len === 1) return self.capitalize();

      var sentence = [];
      var spaces = self.split(WORDS_REGEX).slice(1);
      var i = 0;

      while (i < len) {
        sentence.push(words[i].capitalize());
        sentence.push(spaces[i] != null ? spaces[i] : '');
        i++;
      }

      return sentence.join('');
    }
  };

(function() {
  var StrProto = String.prototype;

  var WHITESPACE = ' \t\n\r\xA0\f\v\u2028\u2029'.split('');

  // var SPACE    = ' ';
  // var TABCHAR  = '\t';
  // var NEWLINE  = '\n';
  // var CRETURN  = '\r';
  // var NBSPACE  = '\xA0';
  // var FFEED    = '\f';
  // var VTAB     = '\v';
  // var LINESEP  = '\u2028';
  // var PARAGSEP = '\u2029';

  function isSpace(str) {
    return WHITESPACE.indexOf(str) > -1;
  }

  function trimLeft(str) {
    var startIdx = 0;

    while (true) {
      if (!isSpace(str[startIdx])) break;
      startIdx++;
    }

    return str.slice(startIdx);
  }

  function trimRight(str) {
    var endIdx = str.length - 1;

    while (true) {
      if (!isSpace(str[endIdx])) break;
      endIdx--;
    }

    return str.slice(0, ++endIdx);
  }

  function trim(str) {
    return trimLeft(trimRight(str));
  }

  StrProto.trimLeft = StrProto.trimLeft || function () {
    return trimLeft(this.valueOf());
  };

  StrProto.trimRight = StrProto.trimRight || function () {
    return trimRight(this.valueOf());
  };

  StrProto.trim = StrProto.trim || function () {
    return trimLeft(trimRight(this.valueOf()));
  };
}());

  _.extend(String.prototype, x_str_proto);
}());
