const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

const userService = require('../../service/user')


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

  test('should create user properly', async () => {
    const user = await userService.createUser('123', 'usernametest')
    expect(user).toMatchObject({_id: '123', username: 'usernametest'})
  })

  test("should add conversation to array", async () => {
    const user = await userService.addConversationToUserById('123', 'conversationID_123')
    expect(user.conversations).toEqual(['conversationID_123'])
  })
})