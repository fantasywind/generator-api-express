passport = require 'passport'<% if (passportMods.local) {%>
passportLocal = require("#{__dirname}/passport-local") passport<% }%>

module.exports = passport