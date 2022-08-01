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
    return {...participant.temp, isAdmin: participant.isAdmin, addedAt: participant.addedAt}
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
      return {...participant.temp, isAdmin: participant.isAdmin, addedAt: participant.addedAt}
    })

    const userParticipant = newConv.participants.find(p => p._id === userID)
    console.log({userParticipant})
    newConv.messages = newConv.messages.filter(m => {
      const messageDate = new Date(m.sentAt)
      console.log('message date: ' + messageDate)
      const participantAddedDate = new Date(userParticipant.addedAt)
      console.log('participant added: ' + participantAddedDate)
      return messageDate > participantAddedDate
    })
    console.log("messagess")
    console.log(newConv.messages)
    convs.push(newConv)
  }

  user._doc.conversations = convs
  socket.emit('chat-joined', user)
}


const joinConversation = async (socket, io, conversationID) => {
  const userID = socket.request.session.userid 
  await conversationService.addParticipantToConversationById(conversationID, {_id: userID, isAdmin: false, addedAt: new Date()})
  await userService.addConversationToUserById(userID, conversationID)
  await socket.join(conversationID)
  socket.emit('conversation-joined') // io.emit(new user joined)
  // emit 10 last messages
  console.log('conv after joining ' + await conversationService.getConversationById(conversationID))

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

const conversationOpened = async (socket, io, { conversationID, openedBy }) => {
  await messageService.markAllAsReadFromConversation(conversationID, openedBy)
  io.to(conversationID).emit('conversation-opened', { conversationID, openedBy })
}

const addParticipants = async (socket, io, { conversationID, participantsIDs }) => {
  const updated = await conversationService.addParticipantsToConversationById(conversationID, participantsIDs.map(p => ({_id: p, isAdmin: false})))
 
 console.log('updateee.. conv')
 console.log(participantsIDs.map(p => ({_id: p, isAdmin: false})))
 console.log(updated)
  // !!!CAREFULL WITH THIS WHEN CHANGIN PARTICIPANT MODEL !!!!
  io.in(participantsIDs).socketsJoin(conversationID)
  for (const participantID of participantsIDs) {
    await userService.addConversationToUserById(participantID, conversationID)
  }
  const aggregateConversation = await conversationService.getAggregateConversationById(conversationID)
  console.log(aggregateConversation)
  // fix temp thing
  aggregateConversation.participants = aggregateConversation.participants.map(participant => {
    return {...participant.temp, isAdmin: participant.isAdmin, addedAt: participant.addedAt}
  })
  
  // Emit event to all new participants
  for (const participantID of participantsIDs) {
    io.to(participantID).emit('new-conversation', aggregateConversation)

    // Emit info message
    const userAdded = await userService.getUserById(participantID)
    const newInfoMessage = await messageService.createInfoMessage(`${userAdded.username} was added to the conversation`, null, conversationID)
    const aggregateMsg = await messageService.getAggregateMessageById(newInfoMessage._id)
    io.to(conversationID).emit('message', aggregateMsg)
  }

  const originalParticipants = aggregateConversation.participants.filter(participant => {
    return !participantsIDs.includes(participant._id)
  })

  // Emit event to the old participants
  // New participants already have updated data
  const newParticipants = aggregateConversation.participants.filter(p => !originalParticipants.includes(p))
  console.log('new')
  console.log(newParticipants)
  originalParticipants.forEach(participant => {
    io.to(participant._id).emit('new-participants', {
      conversationID,
      participants: newParticipants
    })
    console.log('aggre participants')
    console.log(aggregateConversation.participants)
  })

  
}

const removeParticipant = async (socket, io, {conversationID, participant}) => {
  await conversationService.removeParticipantFromConversationById(conversationID, participant)
  await userService.removeConversationFromUserById(participant._id, conversationID)

  const userRemoved = await userService.getUserById(participant._id)
  const newInfoMessage = await messageService.createInfoMessage(`${userRemoved.username} was removed from the conversation`, null, conversationID)
  const aggregateMsg = await messageService.getAggregateMessageById(newInfoMessage._id)
  io.to(conversationID).emit('message', aggregateMsg)

  io.to(conversationID).emit('participant-removed', {conversationID, participant})
  io.in(participant._id).socketsLeave(conversationID)
}

const leaveConversation = async (socket, io, conversationID) => {
  // const userID = socket.request.session.userid 
  // const participant = {
  //   _id: userID
  // }
  // await conversationService.removeParticipantFromConversationById(conversationID, participant)
  // await userService.removeConversationFromUserById(participant._id, conversationID)

  // const userRemoved = await userService.getUserById(participant._id)
  // const newInfoMessage = await messageService.createInfoMessage(`${userRemoved.username} left the conversation`, null, conversationID)
  // const aggregateMsg = await messageService.getAggregateMessageById(newInfoMessage._id)
  // io.to(conversationID).emit('message', aggregateMsg)

  // io.to(conversationID).emit('participant-removed', {conversationID, participant})
  // io.in(participant._id).socketsLeave(conversationID)
}

module.exports = {
  createConversation,
  deleteConversation,
  startConversation,
  joinChat,
  joinConversation,
  leaveConversation,
  conversationOpened,
  addParticipants,
  removeParticipant
}