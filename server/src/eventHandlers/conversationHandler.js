const conversationService = require('../service/conversationService')
const userService = require('../service/userService')
const messageService = require('../service/messageService')


const createConversation = async (socket, io, {name, isPublic, isDM, participants}, ack) => {
  const newConversation = await conversationService.createConversation(name, isPublic, isDM, participants)
  for (const participant of participants) {
    await userService.addConversationToUserById(participant._id, newConversation._id)
    await io.in(participant._id).socketsJoin(newConversation._id)
  }

  const aggregateConversation = await conversationService.getAggregateConversationById(newConversation._id)
  aggregateConversation.participants = aggregateConversation.participants.map(participant => {
    return {...participant.temp, isAdmin: participant.isAdmin}
  })
  socket.to(newConversation._id).emit('new-conversation', aggregateConversation)
  

  console.log(aggregateConversation)
  // Acknowledge response
  ack(aggregateConversation)
}

const deleteConversation = async (socket, io) => {
  throw new Error('deleteConversation() not yet implemented')
}

const startConversation = async (socket, io, otherUserID) => {
  throw new Error('startConversation() not yet implemented')
}

const joinChat = async (socket, io) => {
  const userID = socket.request.session.userid
  const generalConv = await conversationService.getConversationByName('General')
  if (!generalConv.participants.map(p => p._id).includes(userID))
    await joinConversation(socket, io, generalConv._id)
  let user = await userService.getUserById(userID)
  const convs = []
  for (const conversation of user.conversations) {
    const newConv = await conversationService.getAggregateConversationById(conversation)
    newConv.participants = newConv.participants.map(participant => {
      return {...participant.temp, isAdmin: participant.isAdmin}
    })
    convs.push(newConv)
  }

  user._doc.conversations = convs
  socket.emit('chat-joined', user)
}


const joinConversation = async (socket, io, conversationID) => {
  const userID = socket.request.session.userid 
  await conversationService.addParticipantToConversationById(conversationID, {_id: userID, isAdmin: false})
  await userService.addConversationToUserById(userID, conversationID)
  await socket.join(conversationID)
  socket.emit('conversation-joined') // io.emit(new user joined)
  // emit 10 last messages

  // Refactor ugly code
  // Improve performance by creating new service that handles this
  const aggregateConv = await conversationService.getAggregateConversationById(conversationID)
  const participantsWithoutSelf = aggregateConv.participants.filter(p => p._id !== userID)
  participantsWithoutSelf.forEach(p => {
    io.to(p._id).emit('new-participants', {
      conversationID: conversationID,
      participants: [aggregateConv.participants.find(p => p._id === userID)]
    })
  })
}

const leaveConversation = async (socket, io, conversationID) => {
  throw new Error('leaveConversation() not yet implemented')
}

const conversationOpened = async (socket, io, { conversationID, openedBy }) => {
  await messageService.markAllAsReadFromConversation(conversationID, openedBy)
  io.to(conversationID).emit('conversation-opened', { conversationID, openedBy })
}

const addParticipants = async (socket, io, { conversationID, participantsIDs }) => {
  await conversationService.addParticipantsToConversationById(conversationID, participantsIDs.map(p => ({_id: p._id, isAdmin: false})))
  for (const participantID of participantsIDs) {
    await userService.addConversationToUserById(participantID, conversationID)
  }
  const aggregateConversation = await conversationService.getAggregateConversationById(conversationID)
  // Emit event to all new participants
  for (const participantID of participantsIDs) {
    io.to(participantID).emit('new-conversation', aggregateConversation)
  }

  const originalParticipants = aggregateConversation.participants.filter(participant => {
    return !participantsIDs.includes(participant._id)
  })

  // Emit event to the old participants
  // New participants already have updated data
  originalParticipants.forEach(participant => {
    io.to(participant._id).emit('new-participants', {
      conversationID,
      participants: aggregateConversation.participants
    })
  })
}

module.exports = {
  createConversation,
  deleteConversation,
  startConversation,
  joinChat,
  joinConversation,
  leaveConversation,
  conversationOpened,
  addParticipants
}