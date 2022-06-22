const User = require('../models/user')
const mongoose = require('mongoose')

const createUser = async (username) => {
  const newUser = new User({ username, conversations: []})
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
  const aggregateUsers = await User.aggregate([
    {
      $lookup:
        {
          from: "conversation",
          localField: "conversations",
          foreignField: "_id",
          as: "inventory_docs"
        }
    }
  ])
  console.log(aggregateUsers)
}

module.exports = {
  createUser,
  getAllUsers,
  addConversationToUserById,
  getUserById,
  getAggregateUserById
}