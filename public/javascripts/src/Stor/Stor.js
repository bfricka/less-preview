angular
.module('Stor', [])
.factory('Stor', [
  '$q'
  , '$window'
  , '$timeout'
  , '$rootScope'
  , function($q, $window, $timeout, $rootScope) {

    /**
     * Local Storage wrapper
     * @param {string} key optional localStorage key
     * @param {Date|number} exp optional date object or timestamp
     */
    function Stor(key, exp) {
      this._ls = $window.localStorage;
      this._key = key;
      this._exp = exp || null;
      this._update();
    }

    // @todo Implement expiration
    // @todo Use "data:" like amplify and allow for plain strings / nums
    // thus, check for type and only stringify objects.
    Stor.prototype = {
      get: function() {
        return this._data;
      }

      , set: function(val) {
        var self = this;
        var stringified = JSON.stringify({ data: val, expires: self._exp });

        self._ls.setItem(self._getkey(), stringified);

        return self._update();
      }

      , remove: function() {
        this._remove();
        return this._update();
      }

      , _getkey: function (key) {
        return key || '__stor__' + (this._key || '');
      }

      , _get: function() {
        return JSON.parse(this._ls.getItem(this._getkey()));
      }

      , _update: function() {
        var self = this;
        var data = self._get();

        if (!data) {
          self._exp = self._exp || null;
          return self.set(null);
        }

        if (data._exp !== null && data._exp <= self._exp) self.remove();

        self._data = data.data;
        self._exp = data.exp || self._exp;

        return self._data;
      }

      , _remove: function(key) {
        this._ls.removeItem(this._getkey(key));
      }

      , getAsync: function(fn) {
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
    };

    return Stor;
  }
]);