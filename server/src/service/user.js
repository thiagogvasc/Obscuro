const User = require('../models/user')

const createUser = async (id, username) => {
  const newUser = new User({ _id: id, username, conversations: []})
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

module.exports = {
  createUser,
  getAllUsers,
  addConversationToUserById
}