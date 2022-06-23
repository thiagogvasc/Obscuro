const express = require('express')
const http = require('http')
const path = require('path')
const { Server } = require('socket.io')

const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

const dbConnect = async () => {
    const mongoServer = await MongoMemoryServer.create()
    console.log('connecting...')
    await mongoose.connect(mongoServer.getUri(), { dbName: "verifyMASTER" });
    console.log('conneced')
    // your code here
    console.log(mongoServer)
    
    //await mongoose.disconnect();
  }
  dbConnect()



const authMiddleware = require('./src/middleware/auth')
const registerMessageHandler = require('./src/eventHandlers/messageHandler')
const registerUserHandler = require('./src/eventHandlers/userHandler')
const {users} = require('./src/store/userStore')
const {sessions} = require('./src/store/sessionStore')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        // origin: "https://obscuro.herokuapp.com",
        origin: ["http://localhost:3000", "http://localhost:8080"],
        methods: ["GET", "POST"],
        credentials: true
    }
})

const PORT = process.env.PORT || 8080
app.use(express.static(path.join(__dirname, '/client/build')));

app.get('*', (req, res) => {
    console.log('page requested')
    res.sendFile(__dirname + '/client/build/index.html')
})

// Initial store setup
const conversationService = require('./src/service/conversationService')
const registerConversationEvents = require('./src/eventHandlers/conversationHandler')
conversationService.createConversation('General', true, false, [])


const sessionStore = new MongoStore({
    mongooseConnection: mongoose.connection,
    collection: 'sessions'
})
app.use(session({
    secret: 'some secret',
    resave: false,
    saveUnitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}))


io.use(authMiddleware)
io.on('connection', socket => {
    registerUserHandler(socket, io)
    registerMessageHandler(socket, io)
    registerConversationEvents(socket, io)

    socket.on('disconnect', () => {
        // console.log('disconnect')
        // console.log(socket.id)
        // const index = users.findIndex(user => socket.id === user.id && !sessions[socket.sessionID])
        // if (index !== -1) {
        //     console.log('not -1')
        //     users.splice(index, 1)
        // }
        // console.log(users);
    })
})

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`)
})
