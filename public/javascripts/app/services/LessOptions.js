l2c.factory('LessOptions', [
  '$http', '$q'
  , function ($http, $q) {
    var deferred = $q.defer()
      , promise = deferred.promise
      , optionsRequest = $http.get('/less-options').success(function(data) {
        deferred.resolve(new LessOptions(data));
      });

    function LessOptions(data) {
      var self = this
        , defaults = null
        , defer = $q.defer();

      this.getDefaults = function() {
        return data;
      };

      this.opts = {};
    }

    return promise;
  }
]);