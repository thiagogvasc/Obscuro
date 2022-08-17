const User = require('../models/userModel')
const { uuid } = require('uuidv4')

const conversationService = require('./conversationService')
const { generateRandomAvatarOptions } = require('../avatars')

const createUser = async (username, password) => {
  return new User({
    _id: uuid(), 
    username, 
    password,
    conversations: [],
    avatarOptions: JSON.stringify(generateRandomAvatarOptions())
  }).save()
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

const removeConversationFromUserById = async (userID, conversationID) => {
  return User.findOneAndUpdate(
    { _id: userID }, 
    { $pull: { conversations: conversationID } },
    { new: true }
  )
}

const getUserById = async id => {
  return User.findOne({ _id: id }).exec()
}

const getUserByUsername = async username => {
  return User.findOne({ username })
}

const changeAvatarById = async (id, avatarOptions) => {
  return User.findOneAndUpdate({ _id: id }, {avatarOptions}, { new: true})
}

// const getAggregateUserById = async id => {
//   let user = await User.findOne({ _id: id })
//   let aggregateConvs = []
//   for (const c of user.conversations) {
//     const aggregateConv = await conversationService.getAggregateConversationById(c)
//     console.log(aggregateConv)
//     aggregateConvs.push(aggregateConv)
//   }
  
//   user.conversations.push('123')
//   console.log(user)
//   return {
//     _id: user._id,
//     username: user.username,
//     password: user.password,
//     conversations: aggregateConvs
//   }
// }

// const getAggregateUserById = async id => {
//   const aggregateUser = await User.aggregate([
//     {
//       $match: {
//         _id: id
//       }
//     },
//     // {
//     //   $lookup: {
//     //     from: 'conversations',
//     //     localField: 'conversations',
//     //     foreignField: '_id',
//     //     as: 'conversations'
//     //   }
//     // }, 
//     // {
//     //   $unwind: {
//     //     path: '$conversations',
//     //     preserveNullAndEmptyArrays: true
//     //   }
//     // },
//     // {
//     //   $lookup: {
//     //     from: 'messages',
//     //     localField: 'conversations._id',
//     //     foreignField: 'conversation',
//     //     as: 'conversations.messages'
//     //   }
//     // },
//     // {
//     //   $lookup: {
//     //     from: 'users',
//     //     localField: 'conversations.participants._id',
//     //     foreignField: '_id',
//     //     as: 'conversations.participants'
//     //   }
//     // },
//     {
//       $group: {
//         _id: '$_id',
//         username: { $first: '$username' },
//         conversations: { $push: '$conversations'}
//       }
//     }
//   ])
//   return aggregateUser.at(0)
// }

module.exports = {
  createUser,
  createUserWithId,
  getAllUsers,
  addConversationToUserById,
  removeConversationFromUserById,
  getUserById,
  getUserByUsername,
  changeAvatarById
  // getAggregateUserById
}