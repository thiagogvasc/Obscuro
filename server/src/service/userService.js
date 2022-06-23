const User = require('../models/userModel')
const Conversation = require('../models/conversationModel')
const Message = require('../models/messageModel')
const mongoose = require('mongoose')
const { uuid } = require('uuidv4')

const createUser = async (username, id = uuid()) => {
  const newUser = new User({_id: id, username, conversations: []})
  
  const savedUser = await newUser.save()
  return savedUser
}

const getAllUsers = async () => {
  return await User.find()
}

const addConversationToUserById = async (userID, conversationID) => {
  return await User.findOneAndUpdate(
    { _id: userID }, 
    { $push: { conversations: conversationID } },
    { new: true }
  )
}

const getUserById = async id => {
  return await User.findOne({_id: id})
}

const getAggregateUserById = async id => {
  const aggregateUser = await User.aggregate([
    {
      $match: {
        _id: id
      }
    },
    {
      $lookup: {
        from: 'conversations',
        localField: 'conversations',
        foreignField: '_id',
        as: 'conversations'
      }
    }, 
    {
      $unwind: {
        path: '$conversations',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'messages',
        localField: 'conversations._id',
        foreignField: 'conversation',
        as: 'conversations.messages'
      }
    },
    {
      $group: {
        _id: '$_id',
        username: { $first: '$username' },
        conversations: {$push: '$conversations'}
      }
    }
  ])
  return aggregateUser.at(0)
}

module.exports = {
  createUser,
  getAllUsers,
  addConversationToUserById,
  getUserById,
  getAggregateUserById,
}