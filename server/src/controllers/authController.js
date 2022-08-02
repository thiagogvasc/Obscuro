const userService = require('../service/userService')
const conversationService = require('../service/conversationService')


const login = async (req, res) => {
  const { username, password } = req.body
  const user = await userService.getUserByUsername(username)

  // Error handling
  if (!user) return res.status(401).json('Username not found')
  if (user.password !== password) return res.status(401).json('incorrect password')

  console.log('logged in: ' + user._id)
  req.session.userid = user._id
  res.status(200).json({
    message: 'Logged in successfully!',
    userid: user._id
  }) 
}

const logout = async (req, res) => {
  if (req.session && req.session.userid) {
    console.log(req.session)
    req.session.destroy(err => {
      if (err) {
        res.status(400).json('Unable to log out')
      } else {
        res.json('Logged out successfully')
      }
    })
  } else {
    res.end('Not logged in')
  }
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
  const user = await userService.getUserById(userid)
  if (userid) 
    res.status(200).json({userid: userid, user: user})
  else 
    res.status(403).json({message: 'Not authenticated'})
}

module.exports = {
  login,
  signup,
  getSession,
  logout
}