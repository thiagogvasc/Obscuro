const messageService = require('../service/messageService')
const conversationService = require('../service/conversationService')

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
      console.log(message)
      const newMessage = await messageService.createMessage(message.text, message.sender, message.conversation)
      const aggregateMessage = await messageService.getAggregateMessageById(newMessage._id)
      console.log(aggregateMessage)
      io.to(message.conversation).to(message.sender).emit('message', aggregateMessage)
  })
}