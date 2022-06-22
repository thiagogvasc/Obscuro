const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

const conversationService = require('../../service/conversation')

describe("user service", () => {
  let mongoServer

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri)
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongoServer.stop()
  });

  test('should create conversation properly', async () => {
    const conversation = await conversationService.createConversation('conversation_name', true, false, [])
    expect(conversation).toMatchObject({name: 'conversation_name', isPublic: true, isDM: false})
  })

  test("should add participant to conversation", async () => {
    const conversation = await conversationService.addParticipantToConversationByName('conversation_name', 'participant_id')
    expect(conversation.participants).toEqual(['participant_id'])
  })

  test('should get the right conversation by id', async () => {
    // Conversation id is not accessible because it is auto generated
    const conversationByName = await conversationService.getConversationByName('conversation_name')
    const conversationID = conversationByName._id

    const conversationById = await conversationService.getConversationById(conversationID)
    expect(conversationByName).toEqual(conversationById)
  })
})