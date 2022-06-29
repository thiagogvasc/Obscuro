const conversationService = require('../service/conversationService')
const userService = require('../service/userService')


const createConversation = async (socket, io, {name, isPublic, isDM}) => {
  throw new Error('createConversation() not yet implemented')
}

const deleteConversation = async (socket, io) => {
  throw new Error('deleteConversation() not yet implemented')
}

const startConversation = async (socket, io, otherUserID) => {
  throw new Error('startConversation() not yet implemented')
}

const joinConversation = async (socket, io, conversationID) => {
  const userID = socket.request.session.userid 
  const conversationUpdated = await conversationService.addParticipantToConversationById(conversationID, userID)
  const userUpdated = await userService.addConversationToUserById(userID, conversationID)
  socket.emit('conversation-joined')
}

const leaveConversation = async (socket, io, conversationID) => {
  throw new Error('leaveConversation() not yet implemented')
}

module.exports = {
  createConversation,
  deleteConversation,
  startConversation,
  joinConversation,
  leaveConversation
}