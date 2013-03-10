express   = require 'express'
mongo     = require 'mongodb'
http      = require 'http'
less      = require 'less-middleware'
routes    = require './routes'
shortener = require './express/shortener'

app = express()
app.locals.env = app.get('env')

# Perform canonicalization
app.use (req, res, next) ->
  host = req.headers.host
  if host is "less2css.org"
    next()
  else if host is "www.less2css.com" or
  host is "www.less2css.org" or
  host is "less2css.com"
    res.redirect 301, "http://less2css.org#{req.url}"
  else # For localhost
    next()

###
Begin config
###
app.configure ->
  app.set 'port', 3000
  app.set 'views', "#{__dirname}/views"
  app.set 'view engine', 'jade'

  # Enable Gzip
  app.use express.compress()
  # Enable utility middleware
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use app.router
  app.use( less src: "#{__dirname}/public", compress: true )
  return

app.configure 'development', ->
  app.use express.static("#{__dirname}/public")
  app.use( express.errorHandler dumpExceptions: true, showStack: true )
  return

app.configure 'production', ->
  # Use static cache for now until I find something better
  app.use express.staticCache()
  app.use express.static("#{__dirname}/public")
  app.use( express.errorHandler dumpExceptions: true )
  return

# Fall-through 404
app.use routes.fourOhfour

###
Begin Routes
###
app.get '/', routes.index
app.get '/less-options', routes.lessOptions
app.get '/share/:id([A-Za-z0-9]{1,6})', routes.share

app.post '/compile', routes.compile

###
Init
###
http
  .createServer(app)
  .listen app.get('port'), ->
    console.log "Server started on port #{app.get('port')} in #{app.get('env')} mode."