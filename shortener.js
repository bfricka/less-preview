(function() {
  var alphabet, base;

  alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");

  base = alphabet.length;

  exports.encode = function(i) {
    var s;
    if (i === 0) {
      return alphabet[0];
    }
    s = "";
    while (i > 0) {
      s += alphabet[i % base];
      i = parseInt(i / base, 10);
    }
    return s.split("").reverse().join("");
  };

  exports.decode = function(s) {
    var c, i, _i, _len;
    i = 0;
    for (_i = 0, _len = s.length; _i < _len; _i++) {
      c = s[_i];
      i = i * base + alphabet.indexOf(c);
    }
    return i;
  };

}).call(this);
