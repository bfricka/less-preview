_.mixin({
  hasContent: function(obj) {
    return !_.isEmpty(obj);
  }

  , lastIndex: function(obj) {
    return _.size(obj) - 1;
  }

  , slice: function(obj, idx1, idx2) {
    return Array.prototype.slice.call(obj, idx1, idx2);
  }
});