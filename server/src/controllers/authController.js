const userService = require('../service/userService')


const login = async (req, res) => {
  console.log(req.body)
  const { username, password } = req.body
  const user = await userService.getUserByUsername(username)

  // return if username not found
  if (!user) return res.send('username not found')

  if (user.password === password) {
    res.send('logged in')
  } else {
    res.send('incorrect password')
  }
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

module.exports = {
  login,
  signup
}