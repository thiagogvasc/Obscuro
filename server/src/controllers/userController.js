const userService = require('../service/userService')


const getAllUsers = async (req, res) => {
  const users = await userService.getAllUsers()
  res.send(users)
}

module.exports = {
  getAllUsers
}