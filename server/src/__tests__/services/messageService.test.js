const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

const messageService = require('../../service/messageService')


describe("message service", () => {
  let mongoServer

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri)
  })

  afterEach(async () => {
    await mongoose.connection.dropDatabase()
  })

  afterAll(async () => {
    await mongoose.connection.close()
    await mongoServer.stop()
  })

  test('should create message properly', async () => {    
    const userID = 'userID'
    const conversationID = 'conversationID'

    const message = await messageService.createMessage('new message', userID, conversationID)
    const newMsg = await messageService.markAllAsReadFromConversation('conversationID', {by: userID, at: new Date()})
    console.log(await messageService.getMessageById(message._id))
    expect(message).toEqual(expect.objectContaining({
      _id: message._id,
      conversation: 'conversationID',
      isInfo: false,
      read: [],
      sentAt: message.sentAt,
      text: 'new message'
    }))
  })

  test('should mark as delivered properly', async () => {    
    const userID = 'userID'
    const conversationID = 'conversationID'

    const receiverID = 'receiverID'

    const message = await messageService.createMessage('new message', userID, conversationID)
    await messageService.markAsDelivered(conversationID, message._id, {
      to: receiverID,
      at: new Date()
    })

    const deliveredMessage = await messageService.getMessageById(message._id)
    console.log(deliveredMessage)

    expect(readByArray).toHaveLength(1)
    expect(readByArray).toContain(userID)
  })
  // test('should mark as read properly', async () => {    
  //   const userID = 'userID'
  //   const conversationID = 'conversationID'

  //   const message = await messageService.createMessage('new message', userID, conversationID)
  //   await messageService.markAllAsReadFromConversation(conversationID, userID)
  //   await messageService.markAllAsReadFromConversation(conversationID, userID)

  //   const updatedMessage = await messageService.getMessageById(message._id)
  //   const readByArray = updatedMessage.readBy

  //   expect(readByArray).toHaveLength(1)
  //   expect(readByArray).toContain(userID)
  // })
})