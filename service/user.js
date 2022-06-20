const User = require('../models/user')

const createUser = async (id, username) => {
  const user = new User({ _id: id, username })
  return await user.save(err => { throw new Error('Could not save user: ' + err.message)})
}

module.exports = {
  createUser,
}