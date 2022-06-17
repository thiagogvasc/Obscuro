const express = require('express')
const http = require('http')
const path = require('path')
const { Server } = require('socket.io')

const authMiddleware = require('./middleware/auth')
const registerMessageHandler = require('./eventHandlers/messageHandler')
const registerUserHandler = require('./eventHandlers/userHandler')
const {users} = require('./store/userStore')
const {sessions} = require('./store/sessionStore')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        // origin: "https://obscuro.herokuapp.com",
        origin: ["http://localhost:3000"],
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

io.use(authMiddleware)
io.on('connection', socket => {
    socket.on('join-room', room => {
        console.log('joinging room: ' + room)
        socket.join(room)
        io.emit('users', users)
    })

    registerUserHandler(socket, io)
    registerMessageHandler(socket, io)

    socket.on('disconnect', () => {
        console.log('disconnect')
        console.log(socket.id)
        const index = users.findIndex(user => socket.id === user.id && !sessions[socket.sessionID])
        if (index !== -1) {
            console.log('not -1')
            users.splice(index, 1)
        }
        console.log(users);
    })
})

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`)
})
