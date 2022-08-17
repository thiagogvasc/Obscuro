const userService = require('../service/userService')


const getAllUsers = async (req, res) => {
  const users = await userService.getAllUsers()
  res.send(users)
}

const updateAvatar = async (req, res) => {
  console.log(req.params)
  console.log(req.params.id)
  const updatedUser = await userService.changeAvatarById(req.params.id, req.body.avatarOptions)
  if (updatedUser.avatarOptions === req.body.avatarOptions) return res.status(200).json({message: 'Avatar updated successfully!', avatarOptions: updatedUser.avatarOptions})

  res.status(500).json({message: 'Failed updating avatar'})
}

module.exports = {
  getAllUsers,
  updateAvatar
}