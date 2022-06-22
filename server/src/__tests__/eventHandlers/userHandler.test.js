const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");
const mongoose = require('mongoose')

const { MongoMemoryServer } = require('mongodb-memory-server')

const registerUserEvents = require('../../eventHandlers/userHandler')
const conversationService = require('../../service/conversation')
const userService = require('../../service/user');
const Conversation = require('../../models/conversation')
const User = require('../../models/user')


describe("user event handler", () => {
  let io
  let serverSocket
  let clientSocket
  let mongoServer
  let port
  let db

  beforeAll(async () => {
    // setup server
    const httpServer = createServer()
    io = new Server(httpServer)
    httpServer.listen(() => {
      port = httpServer.address().port
      io.on("connection", (socket) => {
        serverSocket = socket;
        registerUserEvents(socket, io)
      })
    })

    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri)

    // setup initial database state
    await conversationService.createConversation('General', true, false, [])
  });


  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongoServer.stop()
    io.close()
    clientSocket.close()
  });

  test('should connect properly', (done) => {
    clientSocket = new Client(`http://localhost:${port}`)
    clientSocket.on('connect', () => {
      done()
    })
  })

  // test("should login properly", (done) => {
  //   clientSocket.on("login-success", user => {
  //     expect(user).toMatchObject({
  //       _id: serverSocket.id,
  //       username: 'thiago'
  //     })

  //     console.log(user)
  //     done()
  //   })

  //   clientSocket.emit('login', {
  //     username: 'thiago'
  //   })
  // })

  // separate loginHandler file so i can reuse the login function here
  // so that the tests can be independendt
  // test('should join general chat', async () => {
  //   const conversation = await Conversation.findOne({name: 'General'})
  //   expect(conversation.participants).toEqual([serverSocket.id])
    
  //   const user = await User.findOne({_id: serverSocket.id})
  //   expect(user.conversations).toEqual([conversation._id.toString()])
  // })
})