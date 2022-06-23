const Message = require('../models/messageModel')
const { uuid } = require('uuidv4')

const createMessage = async (text, senderID, conversationID) => {
  const newMessage = new Message({
    _id: uuid(),
    text,
    sender: senderID,
    conversation: conversationID
  })
  return await newMessage.save()
}

const getMessageById = async id => {
  return await Message.findOne({ _id: id })
}

const getAggregateMessageById = async id => {
  const aggregateMessage = await Message.aggregate([
    {
      $match: {
        _id: id
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'sender',
        foreignField: '_id',
        as: 'sender'
      }
    }, 
    {
      $lookup: {
        from: 'conversations',
        localField: 'conversation',
        foreignField: '_id',
        as: 'conversation'
      }
    },
    {
      $unwind: { path: '$sender' }
    },
    {
      $unwind: { path: '$conversation' }
    }
  ])
  console.log(aggregateMessage)
  return aggregateMessage.at(0)
}

module.exports = {
  createMessage,
  getMessageById,
  getAggregateMessageById
}