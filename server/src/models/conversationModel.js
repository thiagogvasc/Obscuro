const mongoose = require('mongoose')
const { Schema } = mongoose

const conversationSchema = new Schema({
  _id: String,
  name: String,
  isPublic: Boolean,
  isDM: Boolean,
  participants: [{
    _id: String,
    isAdmin: Boolean,
    addedAt: Date
  }]
})

module.exports = mongoose.model('conversation', conversationSchema)