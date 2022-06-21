const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    _id: String,
    username: String
})

module.exports = mongoose.model('user', userSchema)