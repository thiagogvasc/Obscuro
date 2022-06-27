const userHandler = require('../eventHandlers/userHandler')


module.exports = (socket, io) => {
  socket.on('enter room', async ({userInfo, roomInfo}) => {
    userHandler.enterRoom(socket, userInfo, roomInfo)
  })
}