const mongoose = require('mongoose')
const { Schema } = mongoose

const messageSchema = new Schema({
    _id: String,
    text: String,
    sender: String,
    conversation: String,
    readBy: [{ type: String }]
})

module.exports = mongoose.model('message', messageSchema)