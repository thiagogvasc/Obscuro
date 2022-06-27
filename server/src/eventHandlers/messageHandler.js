const messageService = require('../service/messageService')


const sendMessage = async (socket, message) => {
  const newMessage = await messageService.createMessage(message.text, message.sender, message.conversation)
  const aggregateMessage = await messageService.getAggregateMessageById(newMessage._id)
  io.to(message.conversation).to(message.sender).emit('message', aggregateMessage)
}

module.exports = {
  sendMessage
}