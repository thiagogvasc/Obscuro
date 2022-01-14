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

app.get('/favicon.ico', (req, res) => {
    console.log('requesting favicon')
    res.status(204)
})




server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`)
})