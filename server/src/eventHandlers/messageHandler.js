const messageService = require('../service/messageService')

module.exports = (socket, io) => {
  // socket.on('fetch-messages', room => {
  //   socket.emit('messages', messageStore.getAllMessagesTo(socket.id))
  // })
  // socket.on('fetch-messages', () => {
  //   const userID = socket.id
    
  //   console.log(myMessagesObject)
  //   return myMessagesObject
  // })

  socket.on('message', async (message) => {
    console.log('got message test')
      //io.to(message.receiver.id).to(message.sender.id).emit('message', message)
      const newMessage = await messageService.createMessage(message.text, message.sender, message.conversation)
      console.log(newMessage)
      io.to(message.conversation).to(message.sender).emit('message', message)
  })
}