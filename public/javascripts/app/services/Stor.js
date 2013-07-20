(function(){
  /**
   * Local Storage wrapper
   * @param {string} key optional localStorage key
   * @param {Date|number} exp optional date object or timestamp
   */
  function Stor(key, exp) {
    this._ls = window.localStorage;
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
      var stringified = JSON.stringify({ data: val, expires: this._exp });
      this._ls.setItem(this._getkey(), stringified);
      return this._update();
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
      var data = this._get();

      if (!data) {
        this._exp = this._exp || null;
        return this.set(null);
      }

      if (data._exp !== null && data._exp <= this._exp) this.remove();

      this._data = data.data;
      this._exp = data.exp || this._exp;

      return this._data;
    }

    , _remove: function(key) {
      this._ls.removeItem(this._getkey(key));
    }
  };

  l2c.constant('Storage', Stor);
}());


l2c.factory('Stor', [
    '$q'
  , '$rootScope'
  , '$timeout'
  , 'Storage'

  , function($q, $rootScope, $timeout, Storage) {
    _.extend(Storage.prototype, {
      getAsync: function() {
        var fn = arguments[0]
          , args = [].slice.call(arguments, 1)
          , deferred = $q.defer()
          , self = this;

        $timeout(function() {
          var data = self.get.call(self);

          if (data) {
            $rootScope.safeApply(function() {
              deferred.resolve({ data: data, type: 'local' });
            });
          } else {
            var req = fn()
              , ret = { type: 'xhr' };

            req.then(function(res) {
              return $rootScope.safeApply(function() {
                ret.data = res.data;
                ret.status = res.status;

                deferred.resolve(ret);
              });
            });
          }
        }, 1);

        return deferred.promise;
      }
    });

    return Storage;
  }
]);
