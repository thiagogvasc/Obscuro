const express = require('express')
const http = require('http')
const path = require('path')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        // origin: "https://obscuro.herokuapp.com",
        origin: "http://localhost:3000",
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

const users = []

io.on('connection', socket => {
    console.log(`A user connected: ${socket}`)

    socket.on('login', userInfo => {
        users.push({
            id: socket.id,
            userInfo: userInfo
        })
    })

    socket.on('message', messageInfo => {
        console.log(`Message: ${messageInfo}`)
        console.log('Broadcasting message...')
        
        io.emit('message', messageInfo)
    })

    socket.on('disconnect', () => {
        console.log('a user disconnected')
    })
})

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`)
})

server.on('connection', () => {
    console.log('someone connected')
})