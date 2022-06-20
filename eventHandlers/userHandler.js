const {users} = require('../store/userStore')
const {sessions} = require('../store/sessionStore')
const participantStore = require('../store/participantsStore')
const conversationStore = require('../store/conversationStore')

const userService = require('../service/user')

module.exports = (socket, io) => {
  socket.on('login', userInfo => {
    // const user = {
    //     id: socket.id,
    //     sessionID: socket.sessionID,
    //     ...userInfo
    // }
    // users.push(user)
    const user = userService.createUser(socket.id, userInfo.username)
    console.log(user)
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