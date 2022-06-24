const { uuid } = require('uuidv4')

module.exports = (socket, io) => {
  socket.on('create-conversation', ({name, isPublic, isDM}) => {
    const conversation = {
      id: uuid(),
      name,
      isPublic,
      isDM
    }
    conversationStore.createConversation(conversation)
  })

  socket.on('delete-conversation', () => {
    throw new Error('delete-conversation not yet implemented')
  })

  socket.on('start-conversation', otherUserID => {
    const conversation = conversationStore.createConversation(null, false, true)
    participantStore.addConversationParticipant(conversation.id, socket.id)
    participantStore.addConversationParticipant(conversation.id, otherUserID)
  })

  socket.on('join-conversation', conversationID => {
    participantStore.addConversationParticipant(conversationID, socket.id)
  })

  socket.on('leave-conversation', () => {
    throw new Error('leave-conversation not yet implemented')
  })
}