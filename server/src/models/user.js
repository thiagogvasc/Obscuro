const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    username: String,
    conversations: [{ type: Schema.Types.ObjectId }]
})

module.exports = mongoose.model('user', userSchema)