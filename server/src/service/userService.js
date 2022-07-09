const User = require('../models/userModel')
const { uuid } = require('uuidv4')

const createUser = async (username, password) => {
  return new User({_id: uuid(), username, password, conversations: []}).save()
}

const createUserWithId = async (id, username, password) => {
  return new User({_id: id, username, password, conversations: []}).save()
}

const getAllUsers = async () => {
  return User.find()
}

const addConversationToUserById = async (userID, conversationID) => {
  return User.findOneAndUpdate(
    { _id: userID }, 
    { $push: { conversations: conversationID } },
    { new: true }
  )
}

const getUserById = async id => {
  return User.findOne({ _id: id })
}

const getUserByUsername = async username => {
  return User.findOne({ username })
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
        from: 'users',
        localField: 'conversations.participants',
        foreignField: '_id',
        as: 'conversations.participants'
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
        conversations: {$push: '$conversations'},
      }
    }
  ])
  return aggregateUser.at(0)
}

module.exports = {
  createUser,
  createUserWithId,
  getAllUsers,
  addConversationToUserById,
  getUserById,
  getUserByUsername,
  getAggregateUserById
}