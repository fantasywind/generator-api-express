LocalStrategy = require('passport-local').Strategy

module.exports = (passport)->
  passport.use new LocalStrategy (username, password, done)->
    console.log('passport login', arguments)