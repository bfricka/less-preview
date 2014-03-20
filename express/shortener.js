var alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
var base = alphabet.length;

module.exports = {
  encode: function(i) {
    if (i === 0) return alphabet[0];
    var s = '';

    while (i > 0) {
      s += alphabet[i % base];
      i = parseInt(i / base, 10);
    }

    return s.split('').reverse().join('');
  },

  decode: function(s) {
    var len = s.length;
    var i = 0;

    while (i < len) {
      var c = s[i];
      var i = i * base + alphabet.indexOf(c);
    }

    return i;
  }
};