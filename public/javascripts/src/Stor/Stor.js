(function(win) {
  var memoryStor = {
    getItem: function(key) {
      return this[key] || null;
    }
    , setItem: function(key, value) {
      if (arguments.length < 2) throw new Error('localStorage.setItem requires (2) arguments');
      this[key] = '' + value;
    }
    , removeItem: function(key) {
      delete this[key];
    }
  };

  win.memoryStor = memoryStor;

  // I guess give in-memory support for those who don't have localStorage
  if (!('localStorage' in win)) win['localStorage'] = memoryStor;

  var ls = win.localStorage;
  var keyPrefix = '__stor__';
  var key, obj;

  // Purge old entries on page load
  for (key in ls) {
    if (key.indexOf(keyPrefix) !== -1) {
      obj = JSON.parse(ls[key]);
      if (isObjectExpired(obj)) ls.removeItem(key);
    }
  }

  function isObjectExpired(obj) {
    var expires = obj.expires;
    return expires !== null && expires <= getNow();
  }

  function getNow() {
    return new Date().getTime();
  }

  /**
   * localStorage wrapper - Each instance acts as in-memory storage, while managing expiration and persisting all setters to localStorage.
   * @param {String}      key - Storage object key
   * @param {Date|Number} [ttl] - Optional date object or timestamp indicating time to live for data, after which it will be purged (if it is called again)
   * @todo Solidify the separation before session and localStorage by:
   *       1. Public method for `isExpired` and internal reference
   *       2. Separate (internal) get / set for expired and non-expired state. Always properly get / set internally, but only trigger localStorage update when `isExpired` is false. Possibly use the above localStorage dummy object for internal references.
   *       3. The point is we always want `get` to return something if it has existed in the current session, even if it expires halfway through. Additionally, we want to be able to (optionally) not update expiration on each `set`. Right now this works but it's ugly.
   */
  function Stor(key, ttl) {
    if (key == null) throw new Error('Storage Key Required');
    var self = this;
    // Allow creation w/out "new"
    if (!(self instanceof Stor)) return new Stor(key, ttl);

    self._key = '__stor__' + key;
    self._ttl = ttl ? (ttl instanceof Date ? ttl.getTime() : ttl) : null;
    self._sessionData = null;
    self._update();
  }

  Stor.prototype = {
    get: function() {
      return this._data || this._sessionData;
    }

    , set: function(val, refreshExpires) {
      // Refreshes on each `set` by default
      refreshExpires = refreshExpires || refreshExpires == null;
      var self = this;
      var newStorageObject = { 'data': val, 'expires': self._getExpires(refreshExpires) };
      var stringified = JSON.stringify(newStorageObject);

      ls.setItem(self._key, stringified);

      self._sessionData = null;
      self._update();
    }

    , remove: function() {
      this._remove();
      this._update();
    }

    , _getExpires: function(refreshExpires) {
      var self = this;
      return refreshExpires === false && self._previousExpires
        ? self._previousExpires
        : (self._ttl ? getNow() + self._ttl : null);
    }

    , _get: function() {
      return JSON.parse(ls.getItem(this._key));
    }

    , _remove: function() {
      ls.removeItem(this._key);
    }

    , _update: function() {
      var self = this;
      if (self._sessionData !== null) return;

      var storageObject = self._get();
      // Create an empty storage object if one doesn't exist
      if (!storageObject) return self.set(null);

      if (isObjectExpired(storageObject)) {
        console.log("Expiring from session");
        self._sessionData = self._data;
        return self.remove();
      } else {
        self._previousExpires = storageObject.expires;
      }

      self._data = storageObject.data;
    }
  };

  win['Stor'] = Stor;
}(window));