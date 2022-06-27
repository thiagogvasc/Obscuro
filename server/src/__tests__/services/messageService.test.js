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
    expect(message).toMatchObject({
      text: 'new message',
      sender: userID,
      conversation: conversationID  
    })
  })
})