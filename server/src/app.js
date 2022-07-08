const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const conversationService = require('./service/conversationService')
const dbConnect = require('./dbConnect')
const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRouter')
const sessionMiddleware = require('./middleware/sessionMiddleware')

const app = express()

const init = async () => {
    // Initial store setup
    await dbConnect()
    const existingConversation = await conversationService.getConversationByName('General')
    if (!existingConversation) await conversationService.createConversation('General', true, false, [])
    
    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true
    }))
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(sessionMiddleware)
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
}

init()

module.exports = app