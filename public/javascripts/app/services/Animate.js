l2c.service('TransitionHelper', [
  '$window', '$document'
  , function TransitionHelper(win, doc) {
    doc = doc[0];

    var props = this.props = {
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

      var prefixes = ['Webkit', 'Moz', 'O', 'ms']
        , len = prefixes.length
        , i = 0;

      // Capitalize prop
      prop = prop.charAt(0).toUpperCase() + prop.slice(1);

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
      return typeof val === 'number' && !isNaN(val) ? val + 'px' : val;
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
      var elTransform = win.getComputedStyle(el)[props.transform]
        , xVal = normalizePx(axis === 'X' ? val : parseTransform(elTransform).X)
        , yVal = normalizePx(axis === 'Y' ? val : parseTransform(elTransform).Y);

      el.style[props.transform] = 'translate3d('+xVal+','+yVal+',0)';
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

    this.transitionDuration = function(el, val) {
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