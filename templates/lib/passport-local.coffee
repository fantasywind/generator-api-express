LocalStrategy = require('passport-local').Strategy<% if (passportDB === 'mongodb') {%>
mongoose = require 'mongoose'
Member = mongoose.model "<%= passportDBModel%>"<% }%><% if (passportDB === 'mysql') {%>
mysql = require 'mysql'<% }%>

module.exports = (passport)->
  passport.use new LocalStrategy (username, password, done)->
    <% if (passportDB === 'mongodb') {%>
    Member.findOne
      username: username
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
    <% }%>