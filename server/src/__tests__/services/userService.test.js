const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

const userService = require('../../service/user')
const conversationService = require('../../service/conversation')


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

  test('should create user properly', async () => {
    const user = await userService.createUser('usernametest')
    expect(user).toMatchObject({ username: 'usernametest' })
  })

  test("should add conversation to array", async () => {
    const user = await userService.createUser('usernametest')
    const conversation = await conversationService.createConversation('conversationtest', true, false)
    const userUpdated = await userService.addConversationToUserById(user._id, conversation._id)
    expect(userUpdated.conversations).toEqual([conversation._id])
  })

  // test("should aggregate user properly", async () => {
  //   const user = await userService.getUserById('123')
  //   console.log(user)
  //   const conversation = await conversationService.createConversation('conv1', true, false)
  //   console.log(conversation)
  //   await userService.addConversationToUserById('123', conversation._id)
  //   await userService.getAggregateUserById('123')
  // })
})