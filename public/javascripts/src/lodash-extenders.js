_.mixin({
  hasContent: function(obj) {
    return !_.isEmpty(obj);
  }

  , lastIndex: function(obj) {
    return _.size(obj) - 1;
  }
});