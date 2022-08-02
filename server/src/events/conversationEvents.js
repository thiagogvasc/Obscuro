const conversationHandler = require('../eventHandlers/conversationHandler')

module.exports = (socket, io) => {
  socket.on('create-conversation', (payload, ack) => {
    conversationHandler.createConversation(socket, io, payload, ack)
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

  socket.on('conversation-opened', payload => {
    conversationHandler.conversationOpened(socket, io, payload)
  })

  socket.on('add-participants', payload => {
    conversationHandler.addParticipants(socket, io, payload)
  })

  socket.on('remove-participant', payload => {
    conversationHandler.removeParticipant(socket, io, payload)
  }) 

  socket.on('promote-participant', payload => {
    conversationHandler.promoteParticipant(socket, io, payload)
  })
}