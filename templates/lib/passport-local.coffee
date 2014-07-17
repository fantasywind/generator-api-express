LocalStrategy = require('passport-local').Strategy<% if (passportDB === 'mongodb') {%>
mongoose = require 'mongoose'
Member = mongoose.model "<%= passportDBModel%>"<% }%><% if (passportDB === 'mysql') {%>
mysql = require 'mysql'
bcrypt = require 'bcrypt-nodejs'<% }%>

module.exports = (passport)->
  passport.use new LocalStrategy (username, password, done)->
    <% if (passportDB === 'mongodb') {%>
    Member.findOne
      email: username
    , (err, member)->
      return done err if err

      # Not Found
      if !member
        return done null, false,
          message: 'Incorrect username.'

      # Check Password
      if !member.validPasspord password
        return done null, false,
          message: 'Incorrect pasword.'

      done null, member
    <% }%><% if (passportDB === 'mysql') {%>
    conn = passport.mysqlConn
    done "Cannot Connect to Database" if !conn

    # Generate password
    hashPassword = (password)->
      bcrypt.hashSync password, bcrypt.genSaltSync(8), null

    # Check password
    validPassword = (password, hashedPassword)->
      bcrypt.compaseSync password, hashedPassword

    conn.query "SELECT facebookID, name, email, password FROM <%= passportDBModel.toLowerCase()%> WHERE email = ?", [username], (err, rows, field)->
      return done err if err

      # Not Found
      if !rows.length
        return done null, false,
          message: 'Incorrect username.'

      # Check Password
      if !validPasspord password, rows[0].password
        return done null, false,
          message: 'Incorrect pasword.'

      done null, rows[0]

    <% }%>