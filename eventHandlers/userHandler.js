const {users} = require('../store/userStore')
const {sessions} = require('../store/sessionStore')

module.exports = (socket, io) => {
  socket.on('login', userInfo => {
    const user = {
        id: socket.id,
        sessionID: socket.sessionID,
        ...userInfo
    }
    users.push(user)
    socket.emit('login-success', user)
  })

  socket.on('logout', () => {
    delete sessions[socket.sessionID]
    const index = users.findIndex(user => user.id === socket.id)
    users.splice(index, 1)
    socket.disconnect()
  })
}