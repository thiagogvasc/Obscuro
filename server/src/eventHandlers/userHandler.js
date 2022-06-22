const {users} = require('../store/userStore')
const {sessions} = require('../store/sessionStore')
const participantStore = require('../store/participantsStore')
//const conversationStore = require('../store/conversationStore')
const conversationService = require('../service/conversation')

const userService = require('../service/user')

module.exports = (socket, io) => {
  socket.on('login', async userInfo => {
    const user = await userService.createUser(socket.id, userInfo.username)

    // Join general conversation
    const generalConversation = await conversationService.getConversationByName('General')
    await conversationService.addParticipantToConversationByName('General', user._id)
    const userUpdated = await userService.addConversationToUserById(user._id, generalConversation._id)
    
    const aggregateConversations = []
    for (let conversationID of userUpdated.conversations) {
      const conversation = await conversationService.getConversationById(conversationID)
      aggregateConversations.push(conversation)
    }
    userUpdated.conversations = aggregateConversations
    
    socket.emit('login-success', userUpdated) // aggreagte conversations
  })

  socket.on('logout', () => {
    delete sessions[socket.sessionID]
    const index = users.findIndex(user => user.id === socket.id)
    users.splice(index, 1)
    socket.disconnect()
  })
}