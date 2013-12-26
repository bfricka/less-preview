angular
.module('TransitionHelper', [])
.service('TransitionHelper', [
  '$window'
  , '$document'
  , function TransitionHelper($window, $document) {
    var doc = $document[0];
    var self = this;
    var props = self.props = {
        transform: getPrefixedProp('transform')
      , transition: getPrefixedProp('transition')
      , transitionDuration: getPrefixedProp('transitionDuration')
    };

    /**
     * Takes in a w3c CSS property and finds the correct prefix (or w3c)
     * @param  {String} prop w3c property
     * @return {String} Correct property to use
     */
    function getPrefixedProp(prop) {
      // Reference html style declaration for searching
      var rootStyle = doc.documentElement.style;
      if (prop in rootStyle) return prop;

      var prefixes = ['Webkit', 'Moz', 'O', 'ms'];
      var len = prefixes.length;
      var i = 0;

      // Capitalize prop
      prop = prop.capitalize();

      // Choose the correct prefix
      while (i < len) {
        var vendorPrefix = prefixes[i] + prop;
        if (vendorPrefix in rootStyle) return vendorPrefix;
        i++;
      }

      // In case nothing is found just use W3C
      return prop.toLowerCase();
    }

    /**
     * Takes a number or string and normalizes it to px string
     * @param  {String|Number} val Value to normalize
     * @return {String}        px value (e.g. '10px')
     */
    function normalizePx(val) {
      return _.isNumber(val) && !_.isNaN(val) ? val + 'px' : val;
    }

    /**
     * Takes a CSS3 matrix or matrix3d string (from getComputedStyle)
     * and returns the X and Y translate values.
     *
     * @param  {String} str matrix or matrix3d string
     * @return {Object}     Object literal with X / Y properties as floats
     */
    function parseTransform(str) {
      var matrixMatcher = /[\d\.\-]+/g
        , matches = str.match(matrixMatcher)
        , is3D = matches.length > 6
        , transformY = is3D ? matches[14] : matches[5]
        , transformX = is3D ? matches[13] : matches[4];

      return { X: parseFloat(transformX), Y: parseFloat(transformY) };
    }

    this.parseTransform = parseTransform;

    /**
     * window.requestAnimationFrame bound to window
     * @type {Function}
     */
    this.rAF =
      ($window.requestAnimationFrame ||
      $window.mozRequestAnimationFrame ||
      $window.webkitRequestAnimationFrame ||
      $window.msRequestAnimationFrame ||
      function(callback) {
        $window.setTimeout(callback, 1000 / 60);
      }).bind($window);


    // Adding "translateZ" forces the transform to be 3d
    /**
     * Takes an element and 3d translates it along a single axis while maintaining
     * the opposite axis value.
     *
     * @param  {Element} el   DOM element to translate
     * @param  {String}  val  px value
     * @param  {String}  axis Either 'X' or 'Y'
     * @return {void}
     */
    this.translate = function(el, val, axis) {
      var elTransform = el.getComputedStyle(props.transform)
        , xVal = normalizePx(axis === 'X' ? val : parseTransform(elTransform).X)
        , yVal = normalizePx(axis === 'Y' ? val : parseTransform(elTransform).Y);

      el.style[props.transform] = 'translate3d('+xVal+','+yVal+',0)';
    };

    this.translate2d = function(el, posX, posY) {
      var xVal = normalizePx(posX)
        , yVal = normalizePx(posY);

      el.style[props.transform] = 'translate(' + xVal + ',' + yVal + ') translateZ(0)';
    };

    this.translateX = function(el, val) {
      this.translate(el, val, 'X');
    };

    this.translateY = function(el, val) {
      this.translate(el, val, 'Y');
    };

    this.transition = function(el, val) {
      el.style[props.transition] = val;
    };

    this.duration = function(el, val) {
      // As a getter, this returns the millisecond value of the element's transitionDuration
      if (val == null) {
        var duration = el.getComputedStyle(props.transitionDuration);
        if (!duration.length) return 0;
        // Try to split for cases of multiple values, for example: 0.3s, 0.9s
        duration = _.reduce(duration.split(','), function(sum, dur) {
          return sum + parseFloat(dur) || 0;
        }, 0);

        return duration * 1000;
      }

      if (typeof val === 'number' && !isNaN(val)) val = val + 'ms';

      el.style[props.transitionDuration] = val;
    };

    /**
     * Calculates and sets the current transitionend event to use
     * @return {String} transitionend event name
     */
    this.transitionEnd = (function() {
      var transitions = {
        'transition'         : 'transitionend'
        , 'WebkitTransition' : 'webkitTransitionEnd'
        , 'MozTransition'    : 'transitionend'
        , 'OTransition'      : 'oTransitionEnd'
      };

      return transitions[props.transition];
    }());
  }
]);