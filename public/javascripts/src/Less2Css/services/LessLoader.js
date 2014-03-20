angular
.module('Less2Css')
.service('LessLoader', [
  '$q',
  '$http',
  '$window',
  '$timeout',
  function($q, $http, $window, $timeout) {
    var _loadedVersionsCache = {};
    var _lessBasePath = "/javascripts/less/less-{version}.js";

    function _eval(str) {
      /* jshint evil: true */
      $window['eval'].call($window, str);
    }

    _.extend(this, {
      load: function(version, beta) {
        if ($window.less) delete $window.less;

        version = beta ? version + "-beta": version;

        var scriptUrl = _lessBasePath.replace("{version}", version);
        var deferred = $q.defer();

        // Don't make the XHR if we have the script in memory
        if (version in _loadedVersionsCache) {
          _eval(_loadedVersionsCache[version]);
          $timeout(function() { deferred.resolve(); }, 1, false);
          return deferred.promise;
        }

        $http.get(scriptUrl)
          .success(function(data) {
            _eval(data);
            _loadedVersionsCache[version] = data;
            deferred.resolve();
          })
          .error(function() {
            $window.alert('There was a problem loading the selected Less file ' + version);
            deferred.reject();
          });

        return deferred.promise;
      },

      isLoaded: function() {
        return !!$window.less;
      }
    });
  }
]);