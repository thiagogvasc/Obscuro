const messageStore = require('../store/messageStore')

module.exports = (socket, io) => {
  console.log('regiseign events')
  socket.on('fetch-messages', room => {
    socket.emit('messages', messageStore.getAllMessagesTo(socket.id))
  })

  socket.on('message', (message) => {
      io.to(message.receiver.id).to(message.sender.id).emit('message', message)
      messageStore.addMessage(message)
  })
}