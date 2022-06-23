const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

const userService = require('../../service/userService')
const conversationService = require('../../service/conversationService')
const messageService = require('../../service/messageService')


describe("user service", () => {
  let mongoServer

  beforeEach(async () => {
    // change to :
    // beforeeach only drop the collections
    // beforeall mantains the connection to db
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

  test("should aggregate user properly", async () => {
    // Create users
    const user = await userService.createUser('usernametest')    
    const user2 = await userService.createUser('usernametest2') 
    const user3 = await userService.createUser('usernametest3') 

    // Create conversations
    const conversation = await conversationService.createConversation('conv1', true, false)
    const conversation2 = await conversationService.createConversation('conv2', true, false)
   
    // Add conversations to user
    await userService.addConversationToUserById(user._id, conversation._id)
    await userService.addConversationToUserById(user._id, conversation2._id) 

    // Add user to conversations
    await conversationService.addParticipantToConversationByName(conversation.name, user._id)
    await conversationService.addParticipantToConversationByName(conversation2.name, user._id)
    
    // Create message to conv1
    const message1 = await messageService.createMessage('message1', user._id, conversation._id)

    // Get users with conversation data
    const aggregateUser = await userService.getAggregateUserById(user._id)

    expect(aggregateUser).toEqual(
      expect.objectContaining({
        username: 'usernametest',
        conversations: expect.arrayContaining([
          expect.objectContaining({
            name: 'conv1'
          }),
          expect.objectContaining({
            name: 'conv2'
          }),
          expect.objectContaining({
            messages: expect.arrayContaining([
              expect.objectContaining({
                text: 'message1',
                sender: user._id,
                conversation: conversation._id
              })
            ])
          })
        ])
      })
    )
  })
})