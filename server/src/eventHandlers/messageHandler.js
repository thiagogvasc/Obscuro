const { getAggregateConversationById } = require('../service/conversationService')
const messageService = require('../service/messageService')

const webpush = require('web-push')
const Subscription = require('../models/subscriptionModel')


const sendMessage = async (socket, io, message) => {
  let newMessage
  if (message._id) {
    newMessage = await messageService.createMessageWithId(message._id, message.text, message.sender, message.conversation, message.sentAt)
  } else {
    newMessage = await messageService.createMessage(message.text, message.sender, message.conversation, message.sentAt)
  }
  console.log(newMessage)
  const aggregateMessage = await messageService.getAggregateMessageById(newMessage._id)


  for (const p of aggregateMessage.conversation.participants) {
    const conversationID = newMessage.conversation
    const messageID = newMessage._id
    const delivery = {
      to: p._id,
      at: new Date()
    }
    await messageService.markAsDelivered(conversationID, messageID, delivery)
    socket.emit('message-delivered', { conversationID, messageID, delivery })



    // find subscriptions of participants and send notifications
    console.log(p)
    if (p._id !== socket.request.session.userid) {
      console.log('sending to : ' + p._id)
      const participantSubscription = await Subscription.findOne({_id: p._id}).exec()
      console.log(participantSubscription)
      if (participantSubscription) {
        console.log('sending...')
        webpush.sendNotification(participantSubscription.subscription, JSON.stringify(aggregateMessage))
      }
    }
  }


  

  socket.to(message.conversation).emit('message', aggregateMessage.text)
}

const markAsDelivered = async (socket, io, {conversationID, messageID, delivery}) => {
  await messageService.markAsDelivered(conversationID, messageID, delivery)
  socket.to(conversationID).emit('message-delivered', {conversationID, messageID, delivery})
}

// Sends message to the General chat
// messages in the General chat are not persistent
const sendGeneralMessage = async (socket, io, message) => {
  io.to('General', message)
}

module.exports = {
  sendMessage,
  markAsDelivered,
  sendGeneralMessage
}