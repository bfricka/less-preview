l2c.factory('Stor', [
    '$q'
  , '$rootScope'
  , '$timeout'

  , function($q, $rootScope, $timeout) {
    var Stor = (function() {
      Stor.name = 'Stor';

      function Stor(key, exp) {
        this.key = key != null ? key : void 0;
        this.exp = exp != null ? exp : null;
        this.amp = amplify.store;
      }

      Stor.prototype = {
        get: function(key) {
          if (key == null) key = this.key;
          return this.amp(key);
        }

        , set: function(val, key, exp) {
          if (key == null) key = this.key;
          if (exp == null) exp = this.exp;

          return this.amp(key, val, {
            expires: exp
          });
        }

        , remove: function(key) {
          if (key == null) key = this.key;
          this.amp(key, null);
        }

        , empty: function() {
          var storage = this.amp();

          for (var key in storage) {
            this.amp(key, null);
          }
        }

        , getAsync: function() {
          var fn = arguments[0]
            , args = [].slice.call(arguments, 1)
            , q = $q.defer()
            , self = this;

          $timeout(function() {
            var data = self.get.apply(self, args);

            if (data) {
              $rootScope.safeApply($rootScope, function() {
                q.resolve({ data: data, type: 'local' });
              });
            } else {
              var req = fn()
                , ret = { type: 'xhr' };

              req.then(function(res) {
                return $rootScope.safeApply($rootScope, function() {
                  ret.data = res.data;
                  ret.status = res.status;

                  q.resolve(ret);
                });
              });
            }
          }, 1);

          return q.promise;
        }
      };

      return Stor;
    })();

    return Stor;
  }
]);
