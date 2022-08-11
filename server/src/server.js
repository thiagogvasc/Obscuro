const dotenv = require('dotenv')

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.development.local' })
}

const http = require('http')
const app = require('./app')
const io = require('./io')

if (process.env.NODE_ENV === 'development') {
  console.log('Starting development environment...')
}

const server = http.createServer(app)
io.init(server, {
  cors: {
    origin: (process.env.NODE_ENV === 'production' ? "https://obscuro.herokuapp.com" : ["http://localhost:3000", "http://localhost:8080"]),
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
}
})

const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`)
})