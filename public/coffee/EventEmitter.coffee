# ###
# Initialize a new `EventEmitter`.

# @api public
# ###
# class EventEmitter

#   constructor: ->
#     @_callbacks = {}

#   ###
#   Listen on the given `event` with `fn`.

#   @param {String} event
#   @param {Function} fn
#   @return {Emitter}
#   @api public
#   ###
#   on: (event, fn) ->
#     (@_callbacks[event] or= []).push fn
#     this


#   ###
#   Adds an `event` listener that will be invoked a single
#   time then automatically removed.

#   @param {String} event
#   @param {Function} fn
#   @return {Emitter}
#   @api public
#   ###
#   once: (event, fn) ->
#     once = =>
#       @off event, once
#       fn.apply this, arguments
#     fn._off = once
#     @on event, once


#   ###
#   Remove the given callback for `event` or all
#   registered callbacks.

#   @param {String} event
#   @param {Function} fn
#   @return {Emitter}
#   @api public
#   ###
#   off: (event, fn) ->
#     callbacks = @_callbacks[event]
#     return this unless callbacks

#     # remove all handlers
#     if 1 is arguments.length
#       delete @_callbacks[event]
#       return this

#     # remove specific handler
#     i = callbacks.indexOf(fn._off or fn)
#     callbacks.splice i, 1 if ~i
#     this


#   ###
#   Emit `event` with the given args.

#   @param {String} event
#   @param {Mixed} ...
#   @return {Emitter}
#   ###
#   emit: (event, args...) ->
#     callbacks = @_callbacks[event]
#     if callbacks
#       for callback in callbacks.slice 0
#         callback.apply(this, args)
#     this


#   ###
#   Return array of callbacks for `event`.

#   @param {String} event
#   @return {Array}
#   @api public
#   ###
#   listeners: (event) ->
#     @_callbacks[event] or []


#   ###
#   Check if this emitter has `event` handlers.

#   @param {String} event
#   @return {Boolean}
#   @api public
#   ###
#   hasListeners: (event) ->
#     !! @listeners(event).length
