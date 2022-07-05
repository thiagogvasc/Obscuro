const conversationHandler = require('../eventHandlers/conversationHandler')

module.exports = (socket, io) => {
  socket.on('create-conversation', payload => {
    conversationHandler.createConversation(socket, io, payload)
  })

  socket.on('delete-conversation', () => {
    conversationHandler.deleteConversation(socket, io)
  })

  socket.on('start-conversation', payload => {
    conversationHandler.startConversation(socket, io, payload)
  })

  socket.on('join-chat', () => {
    conversationHandler.joinChat(socket, io)
  })

  socket.on('join-conversation', payload => {
    conversationHandler.joinConversation(socket, io, payload)
  })

  socket.on('leave-conversation', payload => {
    conversationHandler.leaveConversation(socket, io, payload)
  })
}