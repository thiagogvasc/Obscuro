const { uuid } = require('uuidv4')

conversations = []

const createConversation = (name, isPublic, isDM) => {
  conversations.push({
    id: uuid(),
    name,
    isPublic,
    isDM
  })
}

const getConversationById = id => {
  conversations.filter(conversation => conversation.id === id)
}


module.exports = {
  createConversation, 
  getConversationById
}