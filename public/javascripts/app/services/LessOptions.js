l2c.factory('LessOptions', [
  '$http', '$q'
  , function ($http, $q) {
    var deferred = $q.defer()
      , promise = deferred.promise;

    $http.get('/less-options').success(function(data) {
      deferred.resolve(data);
    });

    function LessOptions() {
      var self = this;
      self.options = {};
      self.request = promise;

      function mergeOptions(data) {
        _.extend(self.options, data);
      }

      promise.then(mergeOptions);
    }

    return new LessOptions();
  }
]);