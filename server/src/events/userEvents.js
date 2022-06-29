const userHandler = require('../eventHandlers/userHandler')


module.exports = (socket, io) => {
  socket.on('enter room', async payload => {
    userHandler.enterRoom(socket, io, payload)
  })
}