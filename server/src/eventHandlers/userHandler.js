const conversationService = require('../service/conversationService')
const userService = require('../service/userService')

module.exports = (socket, io) => {
  socket.on('login', async userInfo => {
    // create new user
    const user = await userService.createUser(userInfo.username, socket.id)

    // Join general conversation
    const generalConversation = await conversationService.getConversationByName('General')
    await conversationService.addParticipantToConversationByName('General', user._id)
    const userUpdated = await userService.addConversationToUserById(user._id, generalConversation._id)

    const aggregateUser = await userService.getAggregateUserById(user._id)
    
    socket.emit('login-success', aggregateUser) // aggreagte conversations
  })

  socket.on('logout', () => {
    // delete sessions[socket.sessionID]
    // const index = users.findIndex(user => user.id === socket.id)
    // users.splice(index, 1)


    socket.disconnect()
  })
}