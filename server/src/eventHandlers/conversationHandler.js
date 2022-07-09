const conversationService = require('../service/conversationService')
const userService = require('../service/userService')


const createConversation = async (socket, io, {name, isPublic, isDM, participants}) => {
  console.log('create conv')
  const newConversation = await conversationService.createConversation(name, isPublic, isDM, participants)
  console.log(newConversation)
  console.log(participants)
  for (const participant of participants) {
    console.log('participant')
    console.log(participant)
    await userService.addConversationToUserById(participant, newConversation._id)
    await io.in(participant).socketsJoin(newConversation._id)
  }

  console.log('sockets in room created')
  const sockets = await io.in(newConversation._id).fetchSockets();
  console.log(sockets)
  console.log(socket.rooms)
  const aggregateConversation = await conversationService.getAggregateConversationById(newConversation._id)
  io.to(newConversation._id).emit('new-conversation', aggregateConversation)
}

const deleteConversation = async (socket, io) => {
  throw new Error('deleteConversation() not yet implemented')
}

const startConversation = async (socket, io, otherUserID) => {
  throw new Error('startConversation() not yet implemented')
}

const joinChat = async (socket, io) => {
  console.log('io session')
  const userID = socket.request.session.userid
  console.log(userID)
  const generalConv = await conversationService.getConversationByName('General')
  if (!generalConv.participants.includes(userID))
    await joinConversation(socket, io, generalConv._id)
  const aggregateUser = await userService.getAggregateUserById(userID)
  socket.emit('chat-joined', aggregateUser)
}


const joinConversation = async (socket, io, conversationID) => {
  const userID = socket.request.session.userid 
  await conversationService.addParticipantToConversationById(conversationID, userID)
  await userService.addConversationToUserById(userID, conversationID)
  await socket.join(conversationID)
  socket.emit('conversation-joined') // io.emit(new user joined)
  // emit 10 last messages
}

const leaveConversation = async (socket, io, conversationID) => {
  throw new Error('leaveConversation() not yet implemented')
}

module.exports = {
  createConversation,
  deleteConversation,
  startConversation,
  joinChat,
  joinConversation,
  leaveConversation
}