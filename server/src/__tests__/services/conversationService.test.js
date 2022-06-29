const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

const conversationService = require('../../service/conversationService')
const userService = require('../../service/userService')


describe("user service", () => {
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

  test('should create conversation properly', async () => {
    const conversation = await conversationService.createConversation('conversation_name', true, false, [])
    expect(conversation).toMatchObject({name: 'conversation_name', isPublic: true, isDM: false})
  })

  test("should add participant to conversation by name", async () => {
    const conversation = await conversationService.createConversation('conversation_name', true, false, [])
    const user_id = 'user_id'
    const conversationUpdated = await conversationService.addParticipantToConversationByName(conversation.name, user_id)
    expect(conversationUpdated.participants).toEqual([user_id])
  })

  test("should add participant to conversation by id", async () => {
    const conversation = await conversationService.createConversation('conversation_name', true, false, [])
    const user_id = 'user_id'
    const conversationUpdated = await conversationService.addParticipantToConversationById(conversation._id, user_id)
    expect(conversationUpdated.participants).toEqual([user_id])
  })

  test('should get the right conversation by id', async () => {
    const conversation = await conversationService.createConversation('conversation_name', true, false, [])
    const conversationById = await conversationService.getConversationById(conversation._id)
    expect(conversation._id).toEqual(conversationById._id)
  })
})