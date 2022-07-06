const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const conversationService = require('./service/conversationService')
const dbConnect = require('./dbConnect')
const authRouter = require('./routes/authRouter')
const sessionMiddleware = require('./middleware/sessionMiddleware')

const app = express()

const init = async () => {
    // Initial store setup
    await dbConnect()
    const existingConversation = await conversationService.getConversationByName('General')
    if (!existingConversation) await conversationService.createConversation('General', true, false, [])
    
    app.use(cors())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(sessionMiddleware)
    app.use('/auth', authRouter)
}

init()

module.exports = app