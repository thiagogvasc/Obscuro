const userService = require('../service/userService')
const conversationService = require('../service/conversationService')


const login = async (req, res) => {
  const { username, password } = req.body
  const user = await userService.getUserByUsername(username)

  // Error handling
  if (!user) return res.send('username not found')
  if (user.password !== password) return res.send('incorrect password')

  req.session.userid = user._id
  console.log('login new session: ', req.session)
  // Join general chat on login
  // General chat won't have logs on every new user
  // So it's best to handle without events

  // // move all of this somewhere else
  // const general = await conversationService.getConversationByName('General')
  // await conversationService.addParticipantToConversationById(general._id, user._id)
  // await userService.addConversationToUserById(user._id, general._id)

  //res.send(await userService.getAggregateUserById(user._id))
  res.send('logged in')
}

const signup = async (req, res) => {
  const { username, password } = req.body
  const existingUser = await userService.getUserByUsername(username)

  // Username already exists
  if (existingUser) return res.send('user already exists')

  // Create new user
  const newUser = await userService.createUser(username, password)
  res.send('user created')
}

const getSession = async (req, res) => {
  // verify if session is valid exists
  if (req.session.userid) {
    // 
  } else {
    // res.redirect(/login)
  }
}

module.exports = {
  login,
  signup,
  getSession
}