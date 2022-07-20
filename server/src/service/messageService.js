const Message = require('../models/messageModel')
const { uuid } = require('uuidv4')

const createMessage = async (text, senderID, conversationID) => {
  const newMessage = new Message({
    _id: uuid(),
    text,
    sender: senderID,
    conversation: conversationID,
    readBy: []
  })
  return newMessage.save()
}

const markAllAsReadFromConversation = async (conversationID, readBy) => {
  return Message.updateMany({
    readBy: { $nin: [readBy] },
    conversation: conversationID
  }, {
    $push: { readBy }
  }, { new: true })
}

const getMessageById = async id => {
  return Message.findOne({ _id: id })
}

const getAggregateMessageById = async id => {
  return Message.aggregate([
    {
      $match: {
        _id: id
      }
    },
    // {
    //   $lookup: {
    //     from: 'users',
    //     localField: 'sender',
    //     foreignField: '_id',
    //     as: 'sender'
    //   }
    // }, 
    {
      $lookup: {
        from: 'conversations',
        localField: 'conversation',
        foreignField: '_id',
        as: 'conversation'
      }
    },
    // {
    //   $unwind: { path: '$sender' }
    // },
    {
      $unwind: { path: '$conversation' }
    }
  ]).then(result => {
    return result.at(0)
  })
//  // console.log(aggregateMessage)
//   return aggregateMessage.at(0)
}

module.exports = {
  createMessage,
  getMessageById,
  getAggregateMessageById,
  markAllAsReadFromConversation
}