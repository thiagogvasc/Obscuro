const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

const conversationHandler = require('../../eventHandlers/conversationHandler')
const conversationService = require('../../service/conversationService')
const userService = require('../../service/userService')


describe("conversation event handler", () => {
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

  // test('should create conversation properly', async () => {
  //   const socket = {}
  //   const conversationInfo = {
  //     name: 'conv1',
  //     isPublic: true,
  //     isDM: false
  //   }
  //   await conversationHandler.createConversation(socket, conversationInfo)
  // })

  test('should join conversation properly', async () => {
    const socket = {
      emit: jest.fn(),
      request: {
        session: {
          userid: ''
        }
      }
    } 
    const io = {}
    const user = await userService.createUser('username_test', '123456')
    const conversation = await conversationService.createConversation('convName', true, false, [])
    socket.request.session.userid = user._id
    const userID = user._id
    const conversationID = conversation._id

    // join conversation
    await conversationHandler.joinConversation(socket, io, conversationID)

    // expectations
    const conversationById = await conversationService.getConversationById(conversationID)
    expect(conversationById).toEqual(expect.objectContaining({
      participants: expect.arrayContaining([userID])
    }))

    const userById = await userService.getUserById(userID)
    expect(userById).toEqual(expect.objectContaining({
      conversations: expect.arrayContaining([conversationID])
    }))

    expect(socket.emit).toHaveBeenCalledWith('conversation-joined')
  })
})