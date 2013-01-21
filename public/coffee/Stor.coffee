# Storage wrapper: My preferred way of interacting w/ amplify.store
class Stor

  constructor: (key, exp) ->
    @key = (if key? then key else undefined)
    @exp = (if exp? then exp else null)
    @amp = amplify.store

  get: (key = @key) ->
    @amp key

  set: (val, key = @key, exp = @exp) ->
    @amp key, val, exp

  remove: (key = @key) ->
    @amp key, null

  empty: ->
    self = this
    storage = self.amp()
    $.each storage, (itm, key) ->
      self.amp key, null
      return