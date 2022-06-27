const Conversation = require('../models/conversationModel')
const { uuid } = require('uuidv4')

const createConversation = async (name, isPublic, isDM, participants) => {
  const newConversation = new Conversation({
    _id: uuid(),
    name, isPublic, isDM, participants
  })
  return newConversation.save()
}

const getConversationByName = async name => {
  return Conversation.findOne({ name })
}

const getConversationById = async id => {
  return Conversation.findOne({ _id: id })
}

const getParticipantsByConversationId = async id => {
  const conversation = await Conversation.findOne({ _id: id })
  return conversation.participants
}

const addParticipantToConversationByName = async (name, participantID) => {
  return Conversation.findOneAndUpdate(
    { name }, 
    { $push: { participants: participantID } },
    { new: true }
  )
}

module.exports = {
  createConversation,
  getConversationByName,
  getConversationById,
  getParticipantsByConversationId,
  addParticipantToConversationByName
}