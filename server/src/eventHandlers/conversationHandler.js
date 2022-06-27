const createConversation = async (socket, {name, isPublic, isDM}) => {
  throw new Error('createConversation() not yet implemented')
}

const deleteConversation = async (socket) => {
  throw new Error('deleteConversation() not yet implemented')
}

const startConversation = async (socket, otherUserID) => {
  throw new Error('startConversation() not yet implemented')
}

const joinConversation = async (socket, conversationID) => {
  throw new Error('joinConversation() not yet implemented')
}

const leaveConversation = async (socket, conversationID) => {
  throw new Error('leaveConversation() not yet implemented')
}

module.exports = {
  createConversation,
  deleteConversation,
  startConversation,
  joinConversation,
  leaveConversation
}