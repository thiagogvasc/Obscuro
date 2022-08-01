const mongoose = require('mongoose')
const { Schema } = mongoose

const messageSchema = new Schema({
    _id: String,
    text: String,
    sender: {
        _id: String,
        username: String
    },
    conversation: String,
    isInfo: Boolean,
    sentAt: Date,
    readBy: [{ type: String }]
})

module.exports = mongoose.model('message', messageSchema)