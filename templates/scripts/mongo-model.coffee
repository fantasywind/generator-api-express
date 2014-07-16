mongoose = require 'mongoose'<% if (addPassportUtils) {%>
bcrypt = require 'bcrypt-nodejs'<% }%>

<%= classedName%>Schema = mongoose.Schema<% for (var field in fields) {%>
  <%= field%>: <%= fields[field]%><% }%>
<% if (addPassportUtils) {%>
# Hash Generator
<%= classedName%>Schema.methods.validPassword = (password)->
  bcrypt.hashSync password, bcrypt.genSaltSync(8), null

# Check password
<%= classedName%>Schema.methods.validPassword = (password)->
  bcrypt.compaseSync password, @local.password<% }%>

module.exports = mongoose.model "<%= classedName%>", <%= classedName%>Schema