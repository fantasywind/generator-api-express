express = require 'express'
path = require 'path'
logger = require 'morgan'
cookieParser = require 'cookie-parser'
session = require 'express-session'
bodyParser = require 'body-parser'<% if (mongodb) {%>
mongoose = require 'mongoose'<% }%><% if (mysql) {%>
mysql = require 'mysql'<% }%><% if (socketio) {%>
socketIO = require 'socket.io'<% }%><% if (socketio) {%>
memoryStore = new session.MemoryStore
sessionBinder = require "#{__dirname}/lib/session.binder"<% }%><% if (mongodb || mysql) {%>
dbConfig = require "#{__dirname}/config/db.json"<% }%><% if (mysql) {%>

# MySQL Connection
mysqlConn = mysql.createConnection "mysql://#{mysql.user}:#{mysql.pass}@#{mysql.host}:#{mysql.port}/#{mysql.database}"
mysqlConn.connect()<% }%><% if (mongodb) {%>

# MongoDB Connection
mongoConnectArr = []
for mongo in dbConfig.mongo
  mongoConnectArr.push "mongodb://#{mongo.user}:#{mongo.pass}@#{mongo.host}:#{mongo.port}/#{mongo.database}"
mongoose.connect mongoConnectArr.join(',')

# Load MongoDB Models
# End MongoDB Models<% }%>

app = express()

app.set 'port', process.env.PORT || <%= port%>
app.use logger('dev')
app.use session
  secret: 'SESSION_SECRET_KEY'
  resave: true
  saveUninitialized: true
  <% if (socketio) {%>store: memoryStore<% }%>
app.use bodyParser.json()
app.use bodyParser.urlencoded
  extended: true
app.use cookieParser()
app.use express.static(path.join(__dirname, '<%= staticPath%>'))

app.use '/', (req, res)->
  res.json
    status: true
    msg: 'api server is running'

app.use (req, res, next)->
  err = new Error 'Not Found'
  err.status = 404
  next err

if app.get('env') is 'development'
  app.use (err, req, res, next)->
    res.status err.status or 500
    res.render 'error',
      message: err.message
      error: err

app.use (err, req, res, next)->
  res.status err.status or 500
  res.render 'error',
    message: err.message
    error: {}
<% if (socketio) {%>
server = require('http').Server app
io = socketIO server

# Bind Session
io.use (socket, next)-> sessionBinder cookieParser, memoryStore, socket, next

# Socket Connection
io.on 'connection', (socket)->
  console.log 'Connection!!'
  socket.on 'disconnect', ->
    console.log 'Client disconnected.'
server.listen app.get('port'), ->
  console.log "Express API server listening on port #{server.address().port}"
<% } else {%>
server = app.listen app.get('port'), ->
  console.log "Express API server listening on port #{server.address().port}"<% }%>