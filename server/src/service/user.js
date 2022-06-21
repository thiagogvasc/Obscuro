const User = require('../models/user')

const createUser = async (id, username) => {
  const newUser = new User({ _id: id, username })
  const savedUser = await newUser.save()
  return savedUser
}

const getAllUsers = async () => {
  return await User.find()
}

module.exports = {
  createUser,
  getAllUsers
}