const mongoose = require('mongoose')
const { Schema } = mongoose

const conversationSchema = new Schema({
  name: String,
  isPublic: Boolean,
  isDM: Boolean,
  participants: [{ type: String }]
})

module.exports = mongoose.model('conversation', conversationSchema)