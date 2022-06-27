const conversationHandler = require('../eventHandlers/conversationHandler')

module.exports = (socket, io) => {
  socket.on('create-conversation', ({name, isPublic, isDM}) => {
    conversationHandler.createConversation(socket, {name, isPublic, isDM})
  })

  socket.on('delete-conversation', () => {
    conversationHandler.deleteConversation(socket)
  })

  socket.on('start-conversation', otherUserID => {
    conversationHandler.startConversation(socket, otherUserID)
  })

  socket.on('join-conversation', conversationID => {
    conversationHandler.joinConversation(socket, conversationID)
  })

  socket.on('leave-conversation', (conversationID) => {
    conversationHandler.leaveConversation(socket, conversationID)
  })
}