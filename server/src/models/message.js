const mongoose = require('mongoose')
const { Schema } = mongoose

const messageSchema = new Schema({
    text: String,
    sender: Schema.Types.ObjectId,
    conversation: Schema.Types.ObjectId
})

module.exports = mongoose.model('message', messageSchema)