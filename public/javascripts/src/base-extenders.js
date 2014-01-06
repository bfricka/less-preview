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
  }

  , hasClosestEl: function(el) {
    var currentEl = this;

    while (currentEl.parentElement) {
      if (currentEl === el) return true;
      currentEl = currentEl.parentElement;
    }

    return false;
  }

  , getClosest: function(classname) {
    var el = this;

    while(el.parentElement) {
      if (angular.element(el).hasClass(classname))
        return el;

      el = el.parentElement;
    }

    return null;
  }

  , getTop: function() {
    var top = this.offsetTop;
    var parent = this.offsetParent;

    while (parent) {
      top += parent.offsetTop;
      parent = parent.offsetParent;
    }

    return top;
  }

  , childElements: function(selector) {
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

_.extend(String.prototype, {
  capitalize: function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  }
});