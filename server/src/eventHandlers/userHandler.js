const {users} = require('../store/userStore')
const {sessions} = require('../store/sessionStore')
const participantStore = require('../store/participantsStore')
//const conversationStore = require('../store/conversationStore')
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
    
    // // change this
    // const aggregateConversations = []
    // for (let conversationID of userUpdated.conversations) {
    //   const conversation = await conversationService.getConversationById(conversationID)
    //   aggregateConversations.push(conversation)
    // }
    // userUpdated.conversations = aggregateConversations

    const aggregateUser = await userService.getAggregateUserById(user._id)
    
    socket.emit('login-success', aggregateUser) // aggreagte conversations
  })

  socket.on('logout', () => {
    delete sessions[socket.sessionID]
    const index = users.findIndex(user => user.id === socket.id)
    users.splice(index, 1)
    socket.disconnect()
  })
}