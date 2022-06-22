const User = require('../models/user')
const Conversation = require('../models/conversation')
const mongoose = require('mongoose')
const { uuid } = require('uuidv4')

const createUser = async (username) => {
  const newUser = new User({_id: uuid(), username, conversations: []})
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
    }
  ])
  return aggregateUser.at(0)
}

const getAllAggregateUsers = async () => {
  return await User.aggregate([
    {
      $lookup: {
        from: 'conversations',
        localField: 'conversations',
        foreignField: '_id',
        as: 'conversations'
      }
    }
  ])
}

module.exports = {
  createUser,
  getAllUsers,
  addConversationToUserById,
  getUserById,
  getAggregateUserById,
  getAllAggregateUsers
}