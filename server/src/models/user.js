const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    _id: String,
    username: String,
    conversations: [{ type: 'String'}]
})

module.exports = mongoose.model('user', userSchema)