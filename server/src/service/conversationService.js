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

const addParticipantToConversationById = async (conversationID, participantID) => {
  return Conversation.findOneAndUpdate(
    { _id: conversationID }, 
    { $push: { participants: participantID }},
    { new: true }
  )
}

const addParticipantsToConversationById = async (conversationID, participantsIDs) => {
  return Conversation.findOneAndUpdate(
    { _id: conversationID }, 
    { $push: { participants: { $each: participantsIDs }}},
    { new: true }
  )
}

const getAggregateConversationById = async id => {
  const aggregateConversation = await Conversation.aggregate([
    {
      $match: {
        _id: id
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'participants',
        foreignField: '_id',
        as: 'participants'
      }
    },
    {
      $lookup: {
        from: 'messages',
        localField: '_id',
        foreignField: 'conversation',
        as: 'messages'
      }
    },
    // {
    //   $group: {
    //     _id: '$_id',
    //     name: { $first: '$name' },
    //     participants: {$push: '$participants'},
    //     messages: {$push: '$messages'}
    //   }
    // }
  ])
  return aggregateConversation.at(0)
}

module.exports = {
  createConversation,
  getConversationByName,
  getConversationById,
  getParticipantsByConversationId,
  addParticipantToConversationByName,
  addParticipantToConversationById,
  addParticipantsToConversationById,
  getAggregateConversationById
}