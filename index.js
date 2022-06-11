const express = require('express')
const http = require('http')
const path = require('path')
const { Server } = require('socket.io')

const { uuid } = require('uuidv4');

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        // origin: "https://obscuro.herokuapp.com",
        origin: ["http://192.168.0.16:3000"],
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

// Stores arrays of messages directed to the specified user / room
const messages = {
    'general': [],
}

const sessions = {}

io.use((socket, next) => {
   // console.log('in middleware')
    const sessionID = socket.handshake.auth.sessionID;
   // console.log('current session: ' + sessionID)
    // find existing session
   // console.log('finding session...')j
    if (sessionID) {
        if (sessions[sessionID]) {
            const userID = sessions[sessionID]
            socket.id = userID
            socket.sessionID = sessionID
          //  console.log('session found: ' + sessionID)
            socket.emit('authorized')
            return next()
        }
       // console.log('errorr session')
        return next(new Error('invalid session'))
    }

    // create new session
    //console.log('creating new session..')
    const newSession = uuid()
    socket.sessionID = newSession
   // console.log(newSession)
    sessions[newSession] = socket.id
   // console.log('newSession created: ' + newSession)
    return next();
  });


io.on('connection', socket => {
    console.log(`A user connected: ${socket}`)
    socket.on('login', userInfo => {
        // validate

        // user will stay logged in bc of session
        const user = {
            id: socket.id,
            sessionID: socket.sessionID,
            ...userInfo
        }
        users.push(user)

        socket.emit('login-success', user)
        console.log(users)
        console.log('a user logged in')
    })

    socket.on('join-room', room => {
        console.log('joinging room: ' + room)
        socket.join(room)
        io.emit('users', users)
        if (messages[room])
            socket.emit('messages', messages[room])
    })

    socket.on('fetch-messages', room => {
        console.log('messages in room: ')
        console.log(messages[room])
        if (messages[room]) {
            // if private 
            if (room.length === 20) {
                const sentToMeOrSentByMeFilter = message => message.receiver.id === socket.id || message.sender.id === socket.id
                const filteredMessages = messages[room].filter(sentToMeOrSentByMeFilter)
                socket.emit('messages', filteredMessages)
            } else { // is channel
                socket.emit('messages', messages[room])
            }
            console.log('emiting messages from room: ' + room)
            //const messagesToUser = messages[room].filter(message => message.from === socket.id)
            //socket.emit('messages', messages[room])
        } else {
            socket.emit('messages', [])
        }
    })

    socket.on('message', (message) => {
        console.log(`Message: ${message.text} to ${message.receiver.id}`)
        console.log('Broadcasting message...')
        io.to(message.receiver.id).to(message.sender.id).emit('message', message)

        if (messages[message.receiver.id]) {
            messages[message.receiver.id].push(message)

            // is private message
            if (message.receiver.id.length === 20)  {
                if (messages[message.sender.id]) {
                    messages[message.sender.id].push(message)
                } else {
                    messages[message.sender.id] = []
                    messages[message.sender.id].push(message)
                }
            }
        } else {
            messages[message.receiver.id] = []
            messages[message.receiver.id].push(message)

            if (message.receiver.id.length === 20)  {
                if (messages[message.sender.id]) {
                    messages[message.sender.id].push(message)
                } else {
                    messages[message.sender.id] = []
                    messages[message.sender.id].push(message)
                }
            }
        }

        console.log('messages: ')
        for (room in messages) {
            console.log('room: ' + room)
            console.log(messages[room])
        }

        // io.emit('message', message)
    })

    socket.on('logout', () => {
        delete sessions[socket.sessionID]
        const index = users.findIndex(user => user.id === socket.id)
        console.log(users)
        console.log('logout index: ' + index)
        users.splice(index, 1)
        console.log(users)
        socket.disconnect()
    })

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
