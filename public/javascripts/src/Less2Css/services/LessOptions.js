angular
.module('Less2Css')
.service('LessOptions', [
    '$q'
  , '$http'
  , 'Stor'
  , function LessOptions($q, $http, Stor) {
    var self = this;
    var day = 86400000;
    var deferred = $q.defer();
    var promise = deferred.promise.then(mergeOptions);
    var storageTTL = day * 30;
    var stor = Stor('LessOptions', storageTTL);
    var cache = stor.get();

    // Check if we have cache and defaults. Otherwise get options
    if (!cache || !cache.defaults) {
      $http.get('/less-options').success(function(data) {
        deferred.resolve(data);
        // Set cache defaults
        stor.set({ defaults: data });
      });
    } else if (needsOptionsUpdate(cache)) {
      $http.get('/less-options').success(function(data) {
        // Overwrite defaults and lastUpdate
        _.extend(cache, { defaults: data, lastUpdate: getNow() });
        // Any previously non-existent defaults before default options
        _.defaults(cache.options, cache.defaults);
        // Make an exception for new versions of less
        cache.options.versions = cache.defaults.versions;
        // Save cache and resolve
        stor.set(cache);
        deferred.resolve(cache.options);
      });
    } else {
      // If options were saved, use those, otherwise use defaults.
      deferred.resolve(cache.options || cache.defaults);
    }

    _.extend(self, {
      options: {}
      , request: promise
      , setCache: function(data) {
        var newOpts = stor.get();
        newOpts.options = data;
        stor.set(newOpts);
      }
    });

    function needsOptionsUpdate(obj) {
      return !obj.lastUpdate || (obj.lastUpdate + day) < getNow();
    }

    function getNow() {
      return new Date().getTime();
    }

    function mergeOptions(data) {
      _.extend(self.options, data);
    }
  }
]);