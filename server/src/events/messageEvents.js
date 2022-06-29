const messageHandler = require('../eventHandlers/messageHandler')


module.exports = (socket, io) => {
  socket.on('message', async (message) => {
      messageHandler.sendMessage(socket, io, message)
  })
}