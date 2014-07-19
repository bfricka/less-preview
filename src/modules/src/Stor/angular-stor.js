angular
.module('Stor', [])
.factory('Stor', [
  '$q',
  '$window',
  '$timeout',
  '$rootScope',
  function($q, $window, $timeout, $rootScope) {
    var StorageClass = $window.Stor;

    _.extend(StorageClass.prototype, {
      getAsync: function(fn) {
        var ret = {};
        var self = this;
        var data = self.get.call(self); // Try from localStorage
        var deferred = $q.defer();
        var req;

        if (data) {
          var mockdefer = $q.defer();
          req = mockdefer.promise;

          $timeout(function() {
            mockdefer.resolve({ data: data, status: 200, type: 'local' });
          }, 1, false);
        } else {
          req = fn();
          ret.type = 'xhr';
        }

        req.then(function(res) {
          return $rootScope.$safeApply(function() {
            _.extend(ret, res);
            deferred.resolve(ret);
          });
        });

        return deferred.promise;
      }
    });

    return StorageClass;
  }
]);