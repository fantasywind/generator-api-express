FacebookStrategy = require('passport-facebook').Strategy
passportConfig = require "#{__dirname}/passport.json"<% if (passportDB === 'mongodb') {%>
mongoose = require 'mongoose'
Member = mongoose.model "<%= passportDBModel%>"<% }%><% if (passportDB === 'mysql') {%>
mysql = require 'mysql'<% }%>

module.exports = (passport)->
  passport.use new FacebookStrategy
    clientID: passportConfig.facebookAppID
    clientSecret: passportConfig.facebookAppSecret
    callbackURL: passportConfig.facebookRedirectUrl
  , (accessToken, refreshToken, profile, done)->
    <% if (passportDB === 'mongodb') {%>
    Member.findOne
      facebookID: profile.id
    , (err, member)->
      return done err if err

      createMember = ->
        member = new Member
          facebookID: profile.id
          facebookAccessToken: accessToken
          name: profile.name
        member.save (err, member)->
          return done err if err

          done null, member

      # Not Found
      if !member
        # Find same mail
        if profile.email
          Member.findOne
            email: profile.email
          , (err, member)->
            return done err if err

            if !member
              createMember()
            else
              member.facebookID = profile.id
              member.facebookAccessToken = accessToken
              member.name = profile.name if !member.name or member.name is ''
              member.save (err, member)->
                return done err if err

                done null, member
        else
          createMember()

      done null, member<% }%><% if (passportDB === 'mysql') {%>
    conn = passport.mysqlConn
    done "Cannot Connect to Database" if !conn
    
    conn.query "SELECT facebookID, name, email FROM <%= passportDBModel.toLowerCase()%> WHERE facebookID = ?", [profile.id], (err, rows, field)->
      return done err if err

      # Not Found
      if !rows.length

        if profile.email
          conn.query "INSERT INTO <%= passportDBModel.toLowerCase()%> (name, facebookID, facebookAccessToken, email) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE facebookID = ?, facebookAccessToken = ?", [
            profile.name
            profile.id
            accessToken
            profile.email
            profile.id
            accessToken
          ], (err, result)->
            done err if err

            done null, result

        else
          conn.query "INSERT INTO <%= passportDBModel.toLowerCase()%> (name, facebookID, facebookAccessToken, email) VALUES (?, ?, ?, ?)", [
            profile.name
            profile.id
            accessToken
            profile.email
          ], (err, result)->
            done err if err

            done null, result

      done null, rows[0]
    <% }%>