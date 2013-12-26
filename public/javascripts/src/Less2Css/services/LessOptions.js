angular
.module('Less2Css')
.factory('LessOptions', [
    '$q'
  , '$http'
  , 'Stor'
  , function ($q, $http, Stor) {
    var deferred = $q.defer()
      , promise = deferred.promise
      , stor = new Stor('LessOptions', { expires: 31536000000 })
      , cache = stor.get();

    // Check if we have cache and defaults. Otherwise get options
    if (!cache || !cache.defaults) {
      $http.get('/less-options').success(function(data) {
        deferred.resolve(data);
        // Set cache defaults
        stor.set({ defaults: data });
      });
    } else {
      // If options were saved, use those, otherwise use defaults.
      deferred.resolve(cache.options || cache.defaults);
    }

    function LessOptions() {
      var self = this;
      self.options = {};
      // Make request available for resolving if required
      self.request = promise;

      function mergeOptions(data) {
        _.extend(self.options, data);
      }

      self.setCache = function(data) {
        var newOpts = stor.get();
        newOpts.options = data;
        stor.set(newOpts);
      };

      promise.then(mergeOptions);
    }

    return new LessOptions();
  }
]);