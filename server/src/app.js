const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

const sessionMiddleware = require('./middleware/sessionMiddleware')
const conversationService = require('./service/conversationService')
const dbConnect = require('./db')
const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRouter')

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
  app.use(express.static(path.join(__dirname, '../../client/build/')))
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build/index.html'))
  })
  app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build/index.html'))
  })
  app.get('/create-conversation', (req, res) => {
    console.log('create')
    res.sendFile(path.join(__dirname, '../../client/build/index.html'))
  })
  app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build/index.html'))
  })
  app.use(sessionMiddleware)// switch positions
  app.use('/auth', authRouter)// switch positions
  app.use((req, res, next) => {
      const session = req.session;
      if (session && session.userid) {
        next()
      } else {
        next(new Error("unauthorized"))
      }
  })
  app.use('/user', userRouter)
}

init()

module.exports = app