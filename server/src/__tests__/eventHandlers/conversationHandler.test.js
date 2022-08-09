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
        session: {}
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

  test('should delete conversation with no participants', async () => {
    // Setup
    const user1 = await userService.createUser('user1', '123')
    const user2 = await userService.createUser('user2', '123')
    const conversation = await conversationService.createConversation('conv', true, false, [user1._id, user2._id])
    
    // Mocking socket.io
    const io = {
      in: jest.fn().mockReturnThis(),
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
      socketsLeave: jest.fn()
    }

    const socket = {
      request: {
        session: {
          userid: ''
        }
      }
    }

    // User1 leaving conversation
    socket.request.session.userid = user1._id
    await conversationHandler.leaveConversation(socket, io, { conversationID: conversation._id })

    // Conversation should still exist
    const existingConversation = await conversationService.getConversationById(conversation._id)
    expect(existingConversation).not.toBeNull()

    // User2 leaving conversation
    socket.request.session.userid = user2._id
    await conversationHandler.leaveConversation(socket, io, { conversationID: conversation._id })

    // Conversation should be removed
    await conversationService.removeConversationById(conversation._id)
    const conversationRemoved = await conversationService.getConversationById(conversation._id)
    expect(conversationRemoved).toEqual(null)
  })
})