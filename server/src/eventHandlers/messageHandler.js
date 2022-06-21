const messageStore = require('../store/messageStore')
const conversationStore = require('../store/conversationStore')
const participantsStore = require('../store/participantsStore')

module.exports = (socket, io) => {
  // socket.on('fetch-messages', room => {
  //   socket.emit('messages', messageStore.getAllMessagesTo(socket.id))
  // })
  socket.on('fetch-messages', () => {
    const userID = socket.id
    const participants = participantsStore.getAllParticipantsByUserID(userID)
    const myMessages = []
    participants.forEach(participant => {
      const conversationMessages = messageStore.getAllMessagesByConversationID(participant.conversationID)
      myMessages.push(conversationMessages)
    })
    myMessages.flat() // switch to concat
    
    myMessagesObject = {}
    myMessages.forEach(message => {
      const conversation = conversationStore.getConversationById(message.conversationID)
      message.conversation = conversation

      if (!myMessagesObject[message.conversation.id])
        myMessagesObject[message.conversation.id] = []

      console.log('pushing message')
      myMessagesObject[message.conversation.id].push(message)



    //   if (message.receiver.isRoom) {
    //     if (!myMessagesObject[message.receiver.id])
    //       myMessagesObject[message.receiver.id] = []

    //     myMessagesObject[message.receiver.id].push(message)
    //   } else {
    //     if (!myMessagesObject[message.sender.id])
    //       myMessagesObject[message.sender.id] = []

    //     if (!myMessagesObject[message.receiver.id])
    //       myMessagesObject[message.receiver.id] = []
          
    //     myMessagesObject[message.sender.id].push(message)

    //     if (message.sender.id === id)
    //       myMessagesObject[message.receiver.id].push(message)
    //   }
    })
    console.log(myMessagesObject)
    return myMessagesObject
  })

  socket.on('message', (message) => {
      io.to(message.receiver.id).to(message.sender.id).emit('message', message)
      messageStore.addMessage(message)
  })
}