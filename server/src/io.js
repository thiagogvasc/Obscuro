const { Server } = require('socket.io')
const registerConversationEvents = require('./events/conversationEvents')
const registerMessageEvents = require('./events/messageEvents')
const registerUserEvents = require('./events/userEvents')
const sessionMiddleware = require('./middleware/sessionMiddleware')


let io = null
const init = (server, options) => {
  io = new Server(server, options)
  const wrap = middleware => (socket, next) => middleware(socket.request, {}, next)
  io.use(wrap(sessionMiddleware))
  io.on('connection', socket => {
    console.log('connectin: ', socket.request.session)
    registerUserEvents(socket, io)
    registerMessageEvents(socket, io)
    registerConversationEvents(socket, io)
    
    socket.on('disconnect', () => console.log('disconnect'))
  })
}

module.exports = { io, init }