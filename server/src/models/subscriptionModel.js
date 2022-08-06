const mongoose = require('mongoose')
const { Schema } = mongoose

const subscriptionSchema = new Schema({
    _id: String,
    subscription: {}
})

module.exports = mongoose.model('subscription', subscriptionSchema)