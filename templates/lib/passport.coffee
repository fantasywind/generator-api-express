express = require 'express'
passport = require 'passport'<% if (passportMods.local) {%>
passportLocal = require("#{__dirname}/passport-local") passport<% }%>

passport.router = router = express.Router()<% if (passportMods.local) {%>
router.post '/local', passport.authenticate 'local',
  successRedirect: '/auth/success'
  failureRedirect: '/auth/failed'<% }%>

module.exports = passport