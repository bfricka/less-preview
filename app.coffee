express  = require 'express'
mongoose = require 'mongoose'
http     = require 'http'
# path   = require 'path'
less     = require 'less-middleware'

app = express()
app.locals.lessVersions = require('./public/javascripts/lessVersions')['lessVersions']
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

  app.use less
    src: "#{__dirname}/public"
    compress: true

  # Use static cache for now until I find something better
  app.use express.staticCache()
  app.use express.static("#{__dirname}/public")

  # Fall-through 404
  app.use (req, res) ->
    res.status(404)

    if req.accepts('html')
      res.render "404", { title: 'LESS2CSS | 404' }
    else if req.accepts('json')
      res.send { error: 'Not Found' }
    else
      res.type('txt').send '404 Not Found'

  return

# mongoose.connect "mongodb://localhost/less2css"

###
Begin Routes
###

app.get '/', (req, res) ->
  res.render 'less2css', {title: 'LESS2CSS | LESS Live Preview'}

###
Init
###
http
.createServer(app)
.listen app.get('port'), ->
  console.log "Server started on port #{app.get('port')} in #{app.get('env')} mode."