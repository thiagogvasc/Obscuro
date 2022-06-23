const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

const conversationService = require('../../service/conversationService')
const userService = require('../../service/userService')
const messageService = require('../../service/messageService')

describe("message service", () => {
  let mongoServer

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri)
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongoServer.stop()
  });

  test('should create message properly', async () => {
    // Create user and conversation
    const user = await userService.createUser('username')
    const conversation = await conversationService.createConversation('conv1', true, false)

    // Join conversation
    await userService.addConversationToUserById(user._id, conversation._id)
    await conversationService.addParticipantToConversationByName(conversation.name, user._id)
    
    // Send message to conversation from user
    const message = await messageService.createMessage('new message', user._id, conversation._id)
    const aggregateMessage = await messageService.getAggregateMessageById(message._id)
    console.log(aggregateMessage)
    expect(message).toMatchObject({
      text: 'new message',
      sender: user._id,
      conversation: conversation._id  
    })
  })
})