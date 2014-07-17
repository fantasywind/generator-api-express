express = require 'express'
passport = require 'passport'<% if (passportMods.local) {%>
require("#{__dirname}/passport-local") passport<% }%><% if (passportMods.facebook) {%>
require("#{__dirname}/passport-facebook") passport<% }%>

passport.router = router = express.Router()<% if (passportMods.local) {%>
router.post '/local', passport.authenticate 'local',
  successRedirect: '/auth/success'
  failureRedirect: '/auth/failed'<% }%><% if (passportMods.facebook) {%>
router.post '/facebook', passport.authenticate 'facebook',
  scope: [
    'email'
  ]
  successRedirect: '/auth/success'
  failureRedirect: '/auth/failed'<% }%>

module.exports = passport