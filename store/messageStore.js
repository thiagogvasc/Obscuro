const { uuid } = require('uuidv4')

const messages = []

// const addMessage = message => {
//   messages.push(message)
// }

const createMessage = message => {
  const {senderID, conversationID, text} = message
  messages.push({
    id: uuid(),
    senderID,
    conversationID,
    text
  })
}

const getAllMessagesByConversationID = conversationID => {
  messages.filter(message => message.conversationID === conversationID)
}

// const getAllMessagesTo = id => {
//   const myMessages = messages.filter(message => {
//     return message.receiver.id === id || message.receiver.isRoom || (message.sender.id === id && !message.receiver.isRoom)
//   })

//   myMessagesObject = {}
//   myMessages.forEach(message => {
//     if (message.receiver.isRoom) {
//       if (!myMessagesObject[message.receiver.id])
//         myMessagesObject[message.receiver.id] = []

//       myMessagesObject[message.receiver.id].push(message)
//     } else {
//       if (!myMessagesObject[message.sender.id])
//         myMessagesObject[message.sender.id] = []

//       if (!myMessagesObject[message.receiver.id])
//         myMessagesObject[message.receiver.id] = []
        
//       myMessagesObject[message.sender.id].push(message)

//       if (message.sender.id === id)
//         myMessagesObject[message.receiver.id].push(message)
//     }
//   })
//   return myMessagesObject
// }


// module.exports = { addMessage, getAllMessagesTo }

module.exports = {
  createMessage,
  getAllMessagesByConversationID
}