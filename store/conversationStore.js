const { uuid } = require('uuidv4')

conversations = []

const createConversation = (name, isPublic, isDM) => {
  const conversation = {
    id: uuid(),
    name, // unique
    isPublic,
    isDM
  }
  conversations.push(conversation)
  return conversation
}

const getConversationById = id => {
  return conversations.find(conversation => conversation.id === id)
}

const getConversationByName = name => {
  return conversations.find(conversation => conversation.name === name)
}


module.exports = {
  createConversation, 
  getConversationById,
  getConversationByName
}