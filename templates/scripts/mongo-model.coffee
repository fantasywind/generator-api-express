mongoose = require 'mongoose'

<%= classedName%>Schema = mongoose.Schema
  name: String
  size: Number

module.exports = mongoose.model "<%= classedName%>", <%= classedName%>Schema