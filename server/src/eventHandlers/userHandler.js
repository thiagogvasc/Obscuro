const {users} = require('../store/userStore')
const {sessions} = require('../store/sessionStore')
const participantStore = require('../store/participantsStore')
const conversationStore = require('../store/conversationStore')

const userService = require('../service/user')

module.exports = (socket, io) => {
  socket.on('login', async userInfo => {
    const user = await userService.createUser(socket.id, userInfo.username)
    socket.emit('login-success', user)

    // Join general conversation
    const conversation = conversationStore.getConversationByName('General')
    participantStore.addConversationParticipant(conversation.id, user._id) 
  })

  socket.on('logout', () => {
    delete sessions[socket.sessionID]
    const index = users.findIndex(user => user.id === socket.id)
    users.splice(index, 1)
    socket.disconnect()
  })
}