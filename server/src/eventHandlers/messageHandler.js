const messageService = require('../service/messageService')


const sendMessage = async (socket, io, message) => {
  const newMessage = await messageService.createMessage(message.text, message.sender, message.conversation)
  const aggregateMessage = await messageService.getAggregateMessageById(newMessage._id)
  io.to(message.conversation).emit('message', aggregateMessage)
}

// Sends message to the General chat
// messages in the General chat are not persistent
const sendGeneralMessage = async (socket, io, message) => {
  io.to('General', message)
}

module.exports = {
  sendMessage,
  sendGeneralMessage
}