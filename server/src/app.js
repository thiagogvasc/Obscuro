const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const MongoStore = require('connect-mongo')

const conversationService = require('./service/conversationService')
const dbConnect = require('./dbConnect')
const authRouter = require('./routes/authRouter')

const app = express()

const init = async () => {
    // Initial store setup
    const uri = await dbConnect()
    await conversationService.createConversation('General', true, false, [])
        
    const sessionStore = MongoStore.create({
        mongoUrl: uri,
        collectionName: 'sessions'
    })
             
    app.use(session({
        secret: 'some secret',
        resave: false,
        saveUninitialized: true,
        store: sessionStore,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 // 1 day
        }
    }))
            
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use('/auth', authRouter)
}

init()

module.exports = app