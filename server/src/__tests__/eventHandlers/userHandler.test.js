const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");
const mongoose = require('mongoose')

const { MongoMemoryServer } = require('mongodb-memory-server')

const registerUserEvents = require('../../eventHandlers/userHandler')
const conversationService = require('../../service/conversationService')
const userService = require('../../service/userService');
const Conversation = require('../../models/conversationModel')
const User = require('../../models/userModel')


describe("user event handler", () => {
  let io
  let serverSocket
  let clientSocket
  let mongoServer
  let port

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

  test("should login properly", (done) => {
    clientSocket.on("login-success", user => {
      expect(user).toMatchObject({
        _id: serverSocket.id,
        username: 'thiago'
      })
      expect(user.conversations).toEqual(expect.arrayContaining([
        expect.objectContaining({
          name: 'General'
        })
      ]))
      done()
    })

    clientSocket.emit('login', {
      username: 'thiago'
    })
  })
})