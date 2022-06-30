const { Server } = require('socket.io')
const registerConversationEvents = require('./events/conversationEvents')
const registerMessageEvents = require('./events/messageEvents')
const registerUserEvents = require('./events/userEvents')


let io = null
const init = (server, options) => {
  io = new Server(server, options)
  io.on('connection', socket => {
    registerUserEvents(socket, io)
    registerMessageEvents(socket, io)
    registerConversationEvents(socket, io)
    
    socket.on('disconnect', () => console.log('disconnect'))
  })
}

module.exports = { io, init }