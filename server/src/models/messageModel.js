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
    read: [{
        by: String,
        at: Date
    }],
    deliveries: [{
        to: String,
        at: Date
    }],
    likes: [{
        by: String,
        at: Date
    }]
})

module.exports = mongoose.model('message', messageSchema)