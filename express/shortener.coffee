alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("")
base = alphabet.length

exports.encode = (i) ->
  return alphabet[0] if i is 0
  s = ""
  while i > 0
    s += alphabet[i % base]
    i = parseInt(i / base, 10)

  s.split("").reverse().join ""

exports.decode = (s) ->
  i = 0
  for c in s
    i = i * base + alphabet.indexOf c
  i