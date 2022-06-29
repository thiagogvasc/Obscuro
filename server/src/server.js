const http = require('http')
const app = require('./app')
const io = require('./io')

const server = http.createServer(app)
io.init(server, {
  cors: {
    // origin: "https://obscuro.herokuapp.com",
    origin: ["http://localhost:3000", "http://localhost:8080"],
    methods: ["GET", "POST"],
    credentials: true
}
})

const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`)
})