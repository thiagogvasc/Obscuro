const mongoose = require('mongoose')
const { Schema } = mongoose

const conversationSchema = new Schema({
  name: String,
  isPublic: Boolean,
  isDM: Boolean,
  participants: [{ type: Schema.Types.ObjectId }]
})

module.exports = mongoose.model('conversation', conversationSchema)