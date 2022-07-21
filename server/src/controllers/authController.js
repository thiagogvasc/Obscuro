const userService = require('../service/userService')
const conversationService = require('../service/conversationService')


const login = async (req, res) => {
  const { username, password } = req.body
  const user = await userService.getUserByUsername(username)

  // Error handling
  if (!user) return res.status(401).json('Username not found')
  if (user.password !== password) return res.status(401).json('incorrect password')

  req.session.userid = user._id
  res.status(200).json({
    message: 'Logged in successfully!',
    userid: user._id
  }) 
}

const signup = async (req, res) => {
  const { username, password } = req.body
  const existingUser = await userService.getUserByUsername(username)

  // Username already exists
  if (existingUser) return res.status(400).json('Username already exists')

  // Create new user
  const newUser = await userService.createUser(username, password)
  res.status(201).json({
    newUser: newUser,
    message: 'Signed up successfully!'
  })
}

const getSession = async (req, res) => {
  const userid = req.session.userid
  if (userid) 
    res.status(200).json(userid)
  else 
    res.status(403).json({message: 'Not authenticated'})
}

module.exports = {
  login,
  signup,
  getSession
}