express = require 'express'
path = require 'path'
logger = require 'morgan'
cookieParser = require 'cookie-parser'
bodyParser = require 'body-parser'<% if (mongodb) {%>
mongoose = require 'mongoose'<% }%><% if (mysql) {%>
mysql = require 'mysql'<% }%><% if (socketio) {%>
socketIO = require 'socket.io'<% }%>
<% if (mongodb || mysql) {%>
dbConfig = require "#{__dirname}/config/db.json"
<% }%><% if (mongodb) {%>
mongoConnectArr = []
for mongo in dbConfig.mongo
  mongoConnectArr.push "mongodb://#{mongo.user}:#{mongo.pass}@#{mongo.host}:#{mongo.port}/#{mongo.database}"
mongoose.connect mongoConnectArr.join(',')<% }%><% if (mysql) {%>
mysqlConn = mysql.createConnection "mysql://#{mysql.user}:#{mysql.pass}@#{mysql.host}:#{mysql.port}/#{mysql.database}"
mysqlConn.connect()<% }%>

app = express()

app.set 'port', process.env.PORT || <%= port%>
app.use logger('dev')
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
io.on 'connection', (socket)->
  console.log 'connection!!'
  socket.on 'disconnect', ->
    console.log 'Client disconnected.'
server.listen app.get('port'), ->
  console.log "Express API server listening on port #{server.address().port}"
<% } else {%>
server = app.listen app.get('port'), ->
  console.log "Express API server listening on port #{server.address().port}"<% }%>