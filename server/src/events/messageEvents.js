const messageHandler = require('../eventHandlers/messageHandler')


module.exports = (socket, io) => {
  socket.on('message', payload => {
    messageHandler.sendMessage(socket, io, payload)
  })

  socket.on('message-delivered', payload => {
    messageHandler.markAsDelivered(socket, io, payload)
  })

  socket.on('general-message', payload => {
    messageHandler.sendGeneralMessage(socket, io, payload)
  })

  socket.on('like-message', payload => {
    messageHandler.likeMessage(socket, io, payload)
  })
}