const express = require('express')
const http = require('http')
const path = require('path')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

const PORT = process.env.PORT || 8080

app.use(express.static(path.join(__dirname, '/client/build')));


app.get('/', (req, res) => {
    console.log('page requested')
    res.sendFile(__dirname + '/client/build/index.html')
})




server.listen(8080, () => {
    console.log(`Server listening on port ${PORT}`)
})