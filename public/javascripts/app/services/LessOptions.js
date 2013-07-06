l2c.factory('LessOptions', [
  '$http'
  , function ($http) {
    function LessOptions() {
      $http.get('/less-options').success(function(data) {
        this.opts = data;
      });

      this.opts = {};
    }

    return new LessOptions();
  }
]);