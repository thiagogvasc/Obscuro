const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

const conversationService = require('../../service/conversationService')
const userService = require('../../service/userService')

describe("user service", () => {
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

  test('should create conversation properly', async () => {
    const conversation = await conversationService.createConversation('conversation_name', true, false, [])
    expect(conversation).toMatchObject({name: 'conversation_name', isPublic: true, isDM: false})
  })

  test("should add participant to conversation", async () => {
    const conversation = await conversationService.createConversation('conversation_name', true, false, [])
    const user = await userService.createUser('usernametest')
    const conversationUpdated = await conversationService.addParticipantToConversationByName(conversation.name, user._id)
    expect(conversationUpdated.participants).toEqual([user._id])
  })

  test('should get the right conversation by id', async () => {
    const conversation = await conversationService.createConversation('conversation_name', true, false, [])
    const conversationById = await conversationService.getConversationById(conversation._id)
    expect(conversation._id).toEqual(conversationById._id)
  })
})